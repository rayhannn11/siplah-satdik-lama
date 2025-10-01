// react
import React, { Fragment, useEffect, useState } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import { ArrowRoundedDown12x7Svg, ArrowRoundedLeft6x9Svg } from '../../svg';
import { getCategoryParents} from '../../services/utils';
import categoryApi from '../../api/category'

function FilterCategoryTwo(props) {
    const { data, onChangeValue } = props;
    const [categories, setCategories] = useState([])

    const updateValue = (newValue) => {
        onChangeValue({ filter: data, value: newValue.slug });
        onChangeValue({ filter: { ...data, slug: "categoryId" }, value: newValue.id });
    };

    const handleChange = (value) => {
        updateValue(value);
    };

    function dfs(obj, targetId) {
        if (obj.id === targetId) {
            return obj
        }
        if (obj.children) {
            for (let item of obj.children) {
                let check = dfs(item, targetId)
                if (check) {
                    return check
                }
            }
        }
        return null
    }
    const getCategorySelected = (categories) => {
        let result = null

        for (let obj of categories) {
            result = dfs(obj, data.selected)
            if (result) {
                break
            }
        }
        return result;

    }

    useEffect(() => {
        categoryApi.getCategories().then(res => {
            if (res.status.code === 200) {
                const arr = res.data.map(item1 => ({ ...item1, parent: null, children: item1.submenu.menu.map(item2 => ({ ...item2, parent: item1, children: item2.submenu.map(item3 => ({ ...item3, parent: item2, children: item3.submenu.map(item4 => ({ ...item4, parent: item3, })) })) })) }));
                if (data.selected) {
                    setCategories([getCategorySelected(arr)])
                } else {
                    setCategories(res.data)
                }
            }
        });
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const categoriesList = categories.map((category) => {
        const itemClasses = classNames('filter-categories__item', {
            'filter-categories__item--current': Number(data?.selected) === Number(category?.id),
        });

        return (
            <Fragment key={category.id}>
                {getCategoryParents(category).map((parent) => (
                    <li key={parent.id} className="filter-categories__item filter-categories__item--parent">
                        <ArrowRoundedLeft6x9Svg className="filter-categories__arrow" />
                        <span onClick={() => handleChange(parent)} style={{ cursor: 'pointer' }}>{parent.title}</span>
                    </li>
                ))}
                <li className={`d-flex justify-content-between ${itemClasses}`}>
                    <span style={{ cursor: 'pointer' }} onClick={() => handleChange(category)}>{category.title}</span>
                    {((category.children?.length > 0 || Number(category.parentId) === 0) && Number(data.selected) !== Number(category.id)) &&
                        <ArrowRoundedDown12x7Svg style={{fill:'#ccc'}} />
                    }
                </li>
                {category.children && category.children.map((child) => (
                    <li key={child.id} className="d-flex justify-content-between filter-categories__item filter-categories__item--child">
                        <span onClick={() => handleChange(child)} style={{ cursor: 'pointer' }}>{child.title}</span>
                        {child.children?.length > 0 &&
                            <ArrowRoundedDown12x7Svg style={{fill:'#ccc'}} />
                        }
                    </li>
                ))}
            </Fragment>
        );
    });

    if (data.selected) {
        categoriesList.unshift(
            <li key="[shop]" className="filter-categories__item filter-categories__item--parent">
                <ArrowRoundedLeft6x9Svg className="filter-categories__arrow" />
                <span style={{ cursor: 'pointer' }} onClick={() => handleChange('')}>All Products</span>
            </li>,
        );
    }

    return (
        <div className="filter-categories">
            <ul className="filter-categories__list">
                {categoriesList}
            </ul>
        </div>
    );
}

FilterCategoryTwo.propTypes = {
    /**
     * Filter object.
     */
    data: PropTypes.object,
};

export default FilterCategoryTwo;
