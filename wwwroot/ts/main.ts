interface IShowFormOptions {
  submitFunc: () => void
  invokeBtn: HTMLElement
}

interface ICustomerInfo {
  customerId?: number | string,
  name: string,
  country: string
}

class CustomerView {
  private readonly background: HTMLElement
  private readonly icustomerStyle: HTMLElement
  private readonly icustomer: HTMLInputElement
  private readonly ncustomer: HTMLInputElement
  private readonly ccustomer: HTMLInputElement

  public constructor() {
    this.background = this.getElement('form-background')
    this.icustomerStyle = this.getElement('icustomer')
    this.icustomer = this.getElement('icustomer') as HTMLInputElement
    this.ncustomer = this.getElement('ncustomer') as HTMLInputElement
    this.ccustomer = this.getElement('ccustomer') as HTMLInputElement
  }

  public showForm(opt: IShowFormOptions): void {
    try {
      const submitFunc: HTMLElement = this.getElement('customerForm')
      const sendBtn: HTMLElement = this.getElement('send-btn')

      this.background.style.display = 'flex'
      this.background.style.top = `${window.scrollY}px`
      submitFunc.onsubmit = opt.submitFunc
      document.body.style.overflow = 'hidden'

      if(opt.invokeBtn.className === 'add-btn') {
        this.icustomerStyle.style.display = 'block'
        this.ncustomer.value = ''
        this.ccustomer.value = ''
        sendBtn.innerText = 'Crear'
      } else {
        this.icustomerStyle.style.display = 'none'
        this.ncustomer.value = opt.invokeBtn.getAttribute('data-name') ?? ''
        this.ccustomer.value = opt.invokeBtn.getAttribute('data-country') ?? ''
        sendBtn.innerText = 'Actualizar'
      }
    } catch (error) {
      console.error(error)
    }
  }

  public unshowForm(): void {
    this.background.style.display = 'none'
    document.body.style.overflow = 'auto'
  }

  public async addCustomer(event: Event): Promise<void> {
    event.preventDefault()

    const newCustomer: ICustomerInfo = {
      customerId: this.icustomer.value,
      name: this.ncustomer.value,
      country: this.ccustomer.value
    }

    const validation: boolean = Object.values(newCustomer).every(this.isFieldEmpty)
    if(!validation) return

    const dataToSend: ICustomerInfo = {
      customerId: parseInt(newCustomer.customerId as string),
      name: newCustomer.name,
      country: newCustomer.country
    }

    try {
      const res: Response = await fetch('/api/customerapi/addcustomer', {
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

    this.unshowForm()
  }

  public async updateCustomer(event: Event, customerId: number): Promise<void> {
    event.preventDefault()

    const customer: ICustomerInfo = {
      name: this.ncustomer.value,
      country: this.ccustomer.value
    }

    const validation: boolean = Object.values(customer).every(this.isFieldEmpty)
    if(!validation) return

    const dataToSend: ICustomerInfo = {
      customerId: customerId,
      name: customer.name,
      country: customer.country
    }

    try {
      const res: Response = await fetch('/api/customerapi/updatecustomer', {
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

    this.unshowForm()
  }

  public async deleteCustomer(customerId: number): Promise<void> {
    try {
      const res: Response = await fetch(`/api/customerapi/deletecustomer/${customerId}`, {
        method: 'DELETE'
      })
      const data = await res.json()

      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  private getElement(id: string): HTMLElement {
    const element: HTMLElement | null = document.getElementById(id)
    if(!element) throw new Error(`Element with id (${id}) not found`)
    return element
  }

  private isFieldEmpty = (value: string | undefined): boolean => value?.trim() !== ''
}