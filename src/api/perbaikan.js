const perbaikanAPI = {
    perhitunganOrder: async ({ order_id }) => {
        const body = {
            order_id: order_id
        };
        try {
            const response = await fetch(`https://siplahstagingapi.eurekagroup.id/helper/update-calculate-order`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            
            const data = await response.json();
            return data; 
        } catch (error) {
            console.error("Error in perhitunganOrder:", error); 
            throw error; 
        }
    }
};

export default perbaikanAPI;
