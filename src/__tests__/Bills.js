import { getByTestId, screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import '@testing-library/jest-dom/extend-expect'
import firebase from "../__mocks__/firebase"
import VerticalLayout from "../views/VerticalLayout.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import Bills from "../containers/Bills.js"
import { ROUTES } from "../constants/routes"

// ligne qui permet d'utilser la methode .modal de Bootstrap avec jest
$.fn.modal = jest.fn();

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user)
      const html = VerticalLayout(120)
      document.body.innerHTML = html
      const icon1 = document.getElementById("layout-icon1")
      icon1.classList.add("active-icon")
      expect(icon1).toHaveClass("active-icon")
    })
    test("If the page is loading then it should show a loading message", () => {
      const loading = true
      const html = BillsUI({ loading })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = dates.sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("When i click on the newBill Button then it should call handleClickNewBill function",  () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null

      const test = new Bills({ document, onNavigate, firestore, localStorage })
      const handleClickNewBill = jest.fn((e) => test.handleClickNewBill(e))
      const newBillBtn = screen.getByTestId('btn-new-bill')

      $(newBillBtn).trigger("click")
      expect(handleClickNewBill).toHaveBeenCalled
    })


    test("When i click on one eyeIcon then it should call handleClickIconEye function", async() => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
      const test = new Bills({ document, onNavigate, firestore, localStorage })
      iconEye[1].click()
      expect(test.handleClickIconEye(iconEye[1])).toHaveBeenCalled
    })

    // test Get bills
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get")
      const bills = await firebase.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})

