import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

const RevitalisasiModal = ({ isOpen, toggle, onConfirmOrder }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [accountNumber, setAccountNumber] = useState('');
    const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
    const [agreeFundFreeze, setAgreeFundFreeze] = useState(false);
    const [errors, setErrors] = useState({});

    const validateStep = () => {
        const newErrors = {};
        
        if (currentStep === 1) {
            if (!accountNumber) {
                newErrors.accountNumber = 'Nomor rekening harus diisi';
            }
        }
        
        if (currentStep === 2) {
            if (!confirmAccountNumber) {
                newErrors.confirmAccountNumber = 'Konfirmasi nomor rekening harus diisi';
            } else if (accountNumber !== confirmAccountNumber) {
                newErrors.confirmAccountNumber = 'Nomor rekening tidak cocok';
            }
        }
        
        if (currentStep === 3) {
            if (!agreeFundFreeze) {
                newErrors.agreeFundFreeze = 'Anda harus menyetujui pembekuan dana';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            if (currentStep < 3) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleConfirmOrder = () => {
        if (validateStep()) {
            onConfirmOrder({
                accountNumber,
                confirmAccountNumber,
                agreeFundFreeze
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setCurrentStep(1);
        setAccountNumber('');
        setConfirmAccountNumber('');
        setAgreeFundFreeze(false);
        setErrors({});
        toggle();
    };

    const renderStep1 = () => (
        <div className="p-4">
            <div className="text-center mb-4">
                <h5 style={{ color: "#0e336d" }}>Konfirmasi Nomor Rekening</h5>
                <p className="text-muted">Masukkan nomor rekening Anda untuk proses revitalisasi</p>
            </div>
            
            <div className="form-group">
                <label htmlFor="accountNumber">Nomor Rekening</label>
                <input
                    type="text"
                    id="accountNumber"
                    className={`form-control ${errors.accountNumber ? 'is-invalid' : ''}`}
                    placeholder="Masukkan nomor rekening"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                />
                {errors.accountNumber && (
                    <div className="invalid-feedback">{errors.accountNumber}</div>
                )}
            </div>
            
            <div className="d-flex justify-content-between mt-4">
                <button 
                    className="btn btn-secondary" 
                    onClick={handleClose}
                >
                    Batal
                </button>
                <button 
                    className="btn btn-primary" 
                    onClick={handleNext}
                >
                    Lanjut
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="p-4">
            <div className="text-center mb-4">
                <h5 style={{ color: "#0e336d" }}>Konfirmasi Ulang Nomor Rekening</h5>
                <p className="text-muted">Pastikan nomor rekening yang Anda masukkan benar</p>
            </div>
            
            <div className="form-group">
                <label>Nomor Rekening yang Dimasukkan:</label>
                <div className="alert alert-info">
                    <strong>{accountNumber}</strong>
                </div>
            </div>
            
            <div className="form-group">
                <label htmlFor="confirmAccountNumber">Konfirmasi Nomor Rekening</label>
                <input
                    type="text"
                    id="confirmAccountNumber"
                    className={`form-control ${errors.confirmAccountNumber ? 'is-invalid' : ''}`}
                    placeholder="Masukkan ulang nomor rekening"
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value)}
                />
                {errors.confirmAccountNumber && (
                    <div className="invalid-feedback">{errors.confirmAccountNumber}</div>
                )}
            </div>
            
            <div className="d-flex justify-content-between mt-4">
                <button 
                    className="btn btn-secondary" 
                    onClick={handleBack}
                >
                    Kembali
                </button>
                <button 
                    className="btn btn-primary" 
                    onClick={handleNext}
                >
                    Lanjut
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="p-4">
            <div className="text-center mb-4">
                <h5 style={{ color: "#0e336d" }}>Persetujuan Pembekuan Dana</h5>
                <p className="text-muted">Mohon baca dan setujui ketentuan berikut</p>
            </div>
            
            <div className="alert alert-warning">
                <h6><i className="fa fa-exclamation-triangle"></i> Ketentuan Pembekuan Dana</h6>
                <ul className="mb-0">
                    <li>Dana akan dibekukan sementara untuk proses revitalisasi</li>
                    <li>Pembekuan dana berlaku selama proses verifikasi</li>
                    <li>Dana akan dikembalikan jika verifikasi gagal</li>
                    <li>Proses ini tidak dapat dibatalkan setelah konfirmasi</li>
                </ul>
            </div>
            
            <div className="form-group">
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="agreeFundFreeze"
                        checked={agreeFundFreeze}
                        onChange={(e) => setAgreeFundFreeze(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="agreeFundFreeze">
                        Saya menyetujui pembekuan dana sesuai ketentuan di atas
                    </label>
                </div>
                {errors.agreeFundFreeze && (
                    <div className="text-danger mt-2">{errors.agreeFundFreeze}</div>
                )}
            </div>
            
            <div className="d-flex justify-content-between mt-4">
                <button 
                    className="btn btn-secondary" 
                    onClick={handleBack}
                >
                    Kembali
                </button>
                <button 
                    className="btn btn-success" 
                    onClick={handleConfirmOrder}
                    disabled={!agreeFundFreeze}
                >
                    <i className="fa fa-check"></i> Konfirmasi & Buat Pesanan
                </button>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return renderStep1();
            case 2:
                return renderStep2();
            case 3:
                return renderStep3();
            default:
                return renderStep1();
        }
    };

    return (
        <Modal isOpen={isOpen} centered toggle={handleClose} size="md">
            <ModalHeader toggle={handleClose}>
                <div className="d-flex align-items-center">
                    <span>Revitalisasi - Langkah {currentStep} dari 3</span>
                </div>
            </ModalHeader>
            <ModalBody className="p-0">
                {/* Progress Bar */}
                <div className="progress" style={{ height: '4px', borderRadius: 0 }}>
                    <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                    ></div>
                </div>
                
                {renderCurrentStep()}
            </ModalBody>
        </Modal>
    );
};

export default RevitalisasiModal; 