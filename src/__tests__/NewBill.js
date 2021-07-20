import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"

// pb avec la gestion des "e" des fonctions mockées
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then when i click the submit button , the submit shoud be handled", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null

      const mockBill = new NewBill({ document, onNavigate, firestore, localStorage })
      const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
      const handleSubmit = jest.fn ((e) => mockBill.handleSubmit(e))

      $(formNewBill).trigger("submit", handleSubmit())
      expect(handleSubmit).toHaveBeenCalled
    })
    test("Then when i import a file it should run the handleChangeFile function ", async () => {
        const html = NewBillUI()
        document.body.innerHTML = html
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const firestore = null
        const mockBill = new NewBill({ document, onNavigate, firestore, localStorage })
        const handleChangeFile = jest.fn ((e) => mockBill.handleChangeFile(e))
        const file = document.querySelector(`input[data-testid="file"]`)
        file.addEventListener("change", handleChangeFile())
        $(file).trigger("change", handleChangeFile())
        expect(handleChangeFile).toHaveBeenCalled
    })
  })
})