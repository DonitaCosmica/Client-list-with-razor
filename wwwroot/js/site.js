class CustomerFunc {
  static showForm({ submitFunction, invokeBtn }) {
    const background = document.getElementById("form-background")
    
    background.style.display = 'flex'
    background.style.top = `${window.scrollY}px`
    document.body.style.overflow = 'hidden'
    document.getElementById('customerForm').onsubmit = submitFunction
  
    if(invokeBtn.className === 'add-btn') {
      document.getElementById('icustomer').style.display = 'block'
      document.getElementById('ncustomer').defaultValue = ''
      document.getElementById('ccustomer').defaultValue = ''
      document.getElementById('send-btn').innerText = 'Crear'
      return
    }
  
    document.getElementById('icustomer').style.display = 'none'
    document.getElementById('ncustomer').defaultValue = invokeBtn.getAttribute('data-name')
    document.getElementById('ccustomer').defaultValue = invokeBtn.getAttribute('data-country')
    document.getElementById('send-btn').innerText = 'Actualizar'
  }

  static unshowForm() {
    document.getElementById("form-background").style.display = 'none'
    document.body.style.overflow = 'auto'
  }

  static async addCustomer({ event }) {
    event.preventDefault()
    const newCustomer = {
      customerId: document.getElementById('icustomer').value,
      name: document.getElementById('ncustomer').value,
      country: document.getElementById('ccustomer').value
    }
  
    const validation = Object.values(newCustomer).every(this.#isFieldEmpty)
    if(!validation) return
  
    const dataToSend = {
      customerId: parseInt(newCustomer.customerId),
      ...newCustomer
    }
  
    try {
      const res = await fetch('/api/customerapi/addcustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      })
      const data = await res.json()
  
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  
    unshowForm()
  }
  
  static async editCustomer({ event, customerId }) {
    event.preventDefault()
    const newCustomer = {
      name: document.getElementById('ncustomer').value,
      country: document.getElementById('ccustomer').value
    }
  
    const validation = Object.values(newCustomer).every(this.#isFieldEmpty)
    if(!validation) return
  
    const dataToSend = {
      customerId: customerId,
      ...newCustomer
    }
  
    try {
      const res = await fetch('/api/customerapi/updatecustomer', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      })
      const data = await res.json()
  
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  
    unshowForm()
  }

  static async deleteCustomer({ customerId }) {
    try {
      const res = await fetch(`/api/customerapi/deletecustomer/${customerId}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  static #isFieldEmpty(value) {
    return typeof value === 'string' && 
      value.trim().length !== 0 && 
      value !== undefined && 
      value !== null
  }
}