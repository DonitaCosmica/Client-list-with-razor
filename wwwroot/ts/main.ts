interface ICustomerInfo {
  name: string,
  country: string
}

interface MsgRes {
  message: string
}

class CustomerView {
  private readonly background: HTMLElement
  private readonly ncustomer: HTMLInputElement
  private readonly ccustomer: HTMLInputElement
  private funBtn: HTMLButtonElement | null

  public constructor() {
    this.background = this.getElement('form-background')
    this.ncustomer = this.getElement('ncustomer') as HTMLInputElement
    this.ccustomer = this.getElement('ccustomer') as HTMLInputElement
    this.funBtn = null
  }

  public showForm(invokeBtn: HTMLElement): void {
    try {
      const sendBtn: HTMLElement = this.getElement('send-btn')
      const titleForm: HTMLTitleElement = this.getElement('title-form') as HTMLTitleElement

      this.funBtn = invokeBtn as HTMLButtonElement
      this.background.style.display = 'flex'
      this.background.style.top = `${window.scrollY}px`
      document.body.style.overflow = 'hidden'

      if(invokeBtn.className === 'add-btn') {
        titleForm.innerText = 'Agregar nuevo cliente'
        this.ncustomer.value = ''
        this.ccustomer.value = ''
        sendBtn.innerText = 'Crear'
      } else {
        titleForm.innerText = 'Editar cliente'
        this.ncustomer.value = invokeBtn.getAttribute('data-name') ?? ''
        this.ccustomer.value = invokeBtn.getAttribute('data-country') ?? ''
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
      name: this.ncustomer.value,
      country: this.ccustomer.value
    }

    const validation: boolean = Object.values(newCustomer).every(this.isFieldEmpty)
    if(!validation) return

    try {
      const res: Response = await fetch('/api/customerapi/addcustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCustomer)
      })
      const data:MsgRes = await res.json()

      console.log(data.message)
    } catch (error) {
      console.error(error)
    }

    this.unshowForm()
  }

  public async updateCustomer(event: Event): Promise<void> {
    event.preventDefault()

    const customer: ICustomerInfo = {
      name: this.ncustomer.value,
      country: this.ccustomer.value
    }

    const validation: boolean = Object.values(customer).every(this.isFieldEmpty)
    if(!validation) return

    try {
      const customerId: string = this.funBtn?.getAttribute('data-id') ?? ''
      if(customerId === '') throw new Error('Error')

      const res: Response = await fetch(`/api/customerapi/updatecustomer/${customerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
      })
      const data: MsgRes = await res.json()

      console.log(data.message)
    } catch (error) {
      console.error(error)
    }

    this.unshowForm()
  }

  public async deleteCustomer(customerId: string): Promise<void> {
    try {
      const res: Response = await fetch(`/api/customerapi/deletecustomer/${customerId}`, {
        method: 'DELETE'
      })
      const data: MsgRes = await res.json()

      console.log(data.message)
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