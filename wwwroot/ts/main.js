"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class CustomerView {
    constructor() {
        this.isFieldEmpty = (value) => (value === null || value === void 0 ? void 0 : value.trim()) !== '';
        this.background = this.getElement('form-background');
        this.ncustomer = this.getElement('ncustomer');
        this.ccustomer = this.getElement('ccustomer');
        this.funBtn = null;
    }
    showForm(invokeBtn) {
        var _a, _b;
        try {
            const sendBtn = this.getElement('send-btn');
            const titleForm = this.getElement('title-form');
            this.funBtn = invokeBtn;
            this.background.style.display = 'flex';
            this.background.style.top = `${window.scrollY}px`;
            document.body.style.overflow = 'hidden';
            if (invokeBtn.className === 'add-btn') {
                titleForm.innerText = 'Agregar nuevo cliente';
                this.ncustomer.value = '';
                this.ccustomer.value = '';
                sendBtn.innerText = 'Crear';
            }
            else {
                titleForm.innerText = 'Editar cliente';
                this.ncustomer.value = (_a = invokeBtn.getAttribute('data-name')) !== null && _a !== void 0 ? _a : '';
                this.ccustomer.value = (_b = invokeBtn.getAttribute('data-country')) !== null && _b !== void 0 ? _b : '';
                sendBtn.innerText = 'Actualizar';
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    unshowForm() {
        this.background.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    addCustomer(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const newCustomer = {
                name: this.ncustomer.value,
                country: this.ccustomer.value
            };
            const validation = Object.values(newCustomer).every(this.isFieldEmpty);
            if (!validation)
                return;
            try {
                const res = yield fetch('/api/customerapi/addcustomer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCustomer)
                });
                const data = yield res.json();
                console.log(data.message);
            }
            catch (error) {
                console.error(error);
            }
            this.unshowForm();
        });
    }
    updateCustomer(event) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const customer = {
                name: this.ncustomer.value,
                country: this.ccustomer.value
            };
            const validation = Object.values(customer).every(this.isFieldEmpty);
            if (!validation)
                return;
            try {
                const customerId = (_b = (_a = this.funBtn) === null || _a === void 0 ? void 0 : _a.getAttribute('data-id')) !== null && _b !== void 0 ? _b : '';
                if (customerId === '')
                    throw new Error('Error');
                const res = yield fetch(`/api/customerapi/updatecustomer/${customerId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(customer)
                });
                const data = yield res.json();
                console.log(data.message);
            }
            catch (error) {
                console.error(error);
            }
            this.unshowForm();
        });
    }
    deleteCustomer(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(customerId);
                const res = yield fetch(`/api/customerapi/deletecustomer/${customerId}`, {
                    method: 'DELETE'
                });
                const data = yield res.json();
                console.log(data.message);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getElement(id) {
        const element = document.getElementById(id);
        if (!element)
            throw new Error(`Element with id (${id}) not found`);
        return element;
    }
}
//# sourceMappingURL=main.js.map