import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import firebase from "../__mocks__/firebase"
import BillsUI from "../views/BillsUI.js"
import firestore from "../__mocks__/firestore.js"
import Router from "../app/Router.js"
// mock des alertes
var bills
window.alert = jest.fn();
async function getBills () {
  bills = await firebase.get()
  return bills
}
getBills()
// mock firestore
jest.mock("firestore")
firestore.bills = () => ({bills})
window.localStorage.setItem('user', JSON.stringify({
  type:"Employee",
}))
Object.defineProperty(window, 'location' , {value: {hash: ROUTES_PATH['NewBill'] } })

// pb avec la gestion des "e" des fonctions mockées
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then when i click the submit button , the submit shoud be handled", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const user = {
        type: "Employee",
        email: "comrades@billed.com",
        password: "azerty",
        status: "connected"
      }
      window.localStorage.setItem("user", JSON.stringify(user))
      const mockBill = new NewBill({ document, onNavigate, firestore, localStorage })
      const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
      const inp = document.querySelector(`form[data-testid="form-new-bill"]`)
      const handleSubmit = jest.fn ((e={target:inp}) => mockBill.handleSubmit(e))
      formNewBill.addEventListener("submit", handleSubmit)
      $(formNewBill).trigger("submit", handleSubmit)
      expect(handleSubmit).toHaveBeenCalled


    })
    test("Then when i import a file it should run the handleChangeFile function ", async () => {
        const html = NewBillUI()
        document.body.innerHTML = html
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const mockBill = new NewBill({ document, onNavigate, firestore, localStorage })
        const file = document.querySelector(`input[data-testid="file"]`)
        const handleChangeFile = jest.fn ((e={target:file}) => mockBill.handleChangeFile(e))
        file.addEventListener("click", handleChangeFile)
        $(file).trigger("click", handleChangeFile)
        expect(file.value).toBe("")
        expect(handleChangeFile).toHaveBeenCalledTimes(1)
    })
    // test post
    test("fetches bills from mock API POST", async () => {
      const getSpy = jest.spyOn(firebase, "post")
      const bills = await firebase.post()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
