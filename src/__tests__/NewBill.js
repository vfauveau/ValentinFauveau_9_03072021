import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { Router } from "express";

window.alert = jest.fn();



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
      const firestore = null
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
        const user = {
          type: "Employee",
          email: "valentin.fauveau@billed.com",
          password: "azerty",
          status: "connected"
        }
        window.localStorage.setItem("user", JSON.stringify(user))
        // pb avec firestore
        const firestore = null
        const mockBill = new NewBill({ document, onNavigate, firestore, localStorage })
        const file = document.querySelector(`input[data-testid="file"]`)
        const handleChangeFile = jest.fn ((e={target:file}) => mockBill.handleChangeFile(e))
        file.addEventListener("click", handleChangeFile)
        $(file).trigger("click", handleChangeFile)
        expect(handleChangeFile).toHaveBeenCalledTimes(1)
    })
  })
})
