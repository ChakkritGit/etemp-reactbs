/// <reference path="./serial.d.ts" />

import { Terminal } from "xterm"
import CryptoJS from "crypto-js"
import { ESPLoader, FlashOptions, LoaderOptions, Transport } from "esptool-js"
import { useEffect, useRef } from "react"
import { useState } from "react"

type progressType = {
  value: string
}

const term = new Terminal()
term.options = {
  fontSize: 12,
  fontFamily: 'Courier New',
  cursorStyle: 'block',
  theme: {
    background: '#000'
  }
}

let device: SerialPort
let chip: string = ""
let transport: Transport
let esploader: ESPLoader
let isConsoleClosed = false

const filters = [
  { usbVendorId: 0x10c4, usbProductId: 0xea60 }
]

const ESPToolComponent = () => {
  const [baudrates, setBaudrates] = useState('921600')
  const [baudratesConsole, setBaudratesConsole] = useState('115200')
  const terminalRef = useRef<HTMLDivElement>(null)
  const erasButtonRef = useRef<HTMLButtonElement>(null)
  const fileTableRef = useRef<HTMLTableElement>(null)
  const alertmsgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      term.open(terminalRef.current)
    }
  }, [])

  const handleFileSelect = (evt: any) => {
    const file = evt.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = (ev: ProgressEvent<FileReader>) => {
      evt.target.data = ev.target?.result
    }

    reader.readAsBinaryString(file)
  }

  const espLoaderTerminal = {
    clean() {
      term.clear()
    },
    writeLine(data: string | Uint8Array) {
      term.writeln(data)
    },
    write(data: string | Uint8Array) {
      term.write(data)
    },
  }

  const connectDevice = async () => {
    if (!device) {
      device = await navigator.serial.requestPort({ filters })
      transport = new Transport(device, true)
    }

    try {
      const flashOptions = {
        transport,
        baudrate: parseInt(baudrates),
        terminal: espLoaderTerminal,
      } as LoaderOptions
      esploader = new ESPLoader(flashOptions)

      chip = await esploader.main()

      // Temporarily broken
      // await esploader.flashId()
    } catch (e: any) {
      console.error(e)
      term.writeln(`Error: ${e.message}`)
    }

    console.log("Settings done for :" + chip)
  }

  const traceFunc = async () => {
    if (transport) {
      transport.returnTrace()
    }
  }

  const resetFunc = async () => {
    if (transport) {
      await transport.setDTR(false)
      await new Promise((resolve) => setTimeout(resolve, 100))
      await transport.setDTR(true)
    }
  }

  const eraseFunc = async () => {
    erasButtonRef.current!!.disabled = true
    try {
      await esploader.eraseFlash()
    } catch (e: any) {
      console.error(e)
      term.writeln(`Error: ${e.message}`)
    } finally {
      erasButtonRef.current!!.disabled = false
    }
  }

  const addFileFunc = () => {
    const rowCount = fileTableRef.current!!.rows.length
    const row = fileTableRef.current!!.insertRow(rowCount)

    //Column 1 - Offset
    const cell1 = row.insertCell(0)
    const element1 = document.createElement("input")
    element1.type = "text"
    element1.id = "offset" + rowCount
    element1.value = "0x1000"
    cell1.appendChild(element1)

    // Column 2 - File selector
    const cell2 = row.insertCell(1)
    const element2 = document.createElement("input")
    element2.type = "file"
    element2.id = "selectFile" + rowCount
    element2.name = "selected_File" + rowCount
    element2.addEventListener("change", handleFileSelect, false)
    cell2.appendChild(element2)

    // Column 3  - Progress
    const cell3 = row.insertCell(2)
    cell3.classList.add("progress-cell")
    cell3.style.display = "none"
    cell3.innerHTML = `<progress value="0" max="100"></progress>`

    // Column 4  - Remove File
    const cell4 = row.insertCell(3)
    cell4.classList.add("action-cell")
    if (rowCount > 1) {
      const element4 = document.createElement("input")
      element4.type = "button"
      const btnName = "button" + rowCount
      element4.name = btnName
      element4.setAttribute("class", "btn")
      element4.setAttribute("value", "Remove") // or element1.value = "button"
      element4.onclick = function () {
        removeRow(row)
      }
      cell4.appendChild(element4)
    }
  }

  const removeRow = (row: HTMLTableRowElement) => {
    const rowIndex = Array.from(fileTableRef.current!!.rows).indexOf(row)
    fileTableRef.current!!.deleteRow(rowIndex)
  }

  const disconnectFunc = async () => {
    if (transport) await transport.disconnect()
    term.reset()
    cleanUp()
  }

  const cleanUp = () => {
    device = null as unknown as SerialPort
    transport = null as unknown as Transport
    chip = null as unknown as string
  }

  const consoleStartFunc = async () => {
    if (!device) {
      device = await navigator.serial.requestPort({ filters })
      transport = new Transport(device, true)
    }
    await transport.connect(parseInt(baudratesConsole))
    isConsoleClosed = false

    while (true && !isConsoleClosed) {
      const val = await transport.rawRead()
      if (typeof val !== "undefined") {
        term.write(val)
      } else {
        break
      }
    }
    console.log("quitting console")
  }

  const consoleStopFunc = async () => {
    isConsoleClosed = true
    if (transport) {
      await transport.disconnect()
      await transport.waitForUnlock(1500)
    }
    term.reset()
    cleanUp()
  }

  const validateProgramInputs = () => {
    const offsetArr: number[] = []
    const rowCount = fileTableRef.current!!.rows.length
    let row
    let offset = 0
    let fileData = null

    // Check for mandatory fields
    for (let index = 1; index < rowCount; index++) {
      row = fileTableRef.current!!.rows[index]

      // Offset fields checks
      const offSetObj = row.cells[0].childNodes[0] as HTMLInputElement
      offset = parseInt(offSetObj.value)

      // Non-numeric or blank offset
      if (Number.isNaN(offset)) {
        return "Offset field in row " + index + " is not a valid address!"
      }
      // Repeated offset used
      else if (offsetArr.includes(offset)) {
        return "Offset field in row " + index + " is already in use!"
      }
      else {
        offsetArr.push(offset)
      }

      const fileObj = row.cells[1].childNodes[0] as HTMLInputElement
      fileData = fileObj.value  // Assuming you meant to use .value here instead of .data
      if (fileData == null || fileData === "") {
        return "No file selected for row " + index + "!"
      }
    }
    return "success"
  }

  const programFunc = async () => {
    const err = validateProgramInputs()

    if (err != "success") {
      alertmsgRef.current!!.innerHTML = "<strong>" + err + "</strong>"
      alertmsgRef.current!!.style.display = "block"
      return
    }

    // Hide error message
    alertmsgRef.current!!.style.display = "none"

    const fileArray = []
    const progressBars: progressType[] = []

    for (let index = 1; index < fileTableRef.current!!.rows.length; index++) {
      const row = fileTableRef.current!!.rows[index]

      const offSetObj = row.cells[0].childNodes[0] as HTMLInputElement
      const offset = parseInt(offSetObj.value)

      const fileObj = row.cells[1].childNodes[0] as ChildNode & { data: string }
      const progressBar = row.cells[2].childNodes[0] as unknown as progressType

      progressBar.value = "0"
      progressBars.push(progressBar)

      row.cells[2].style.display = "initial"
      row.cells[3].style.display = "none"

      fileArray.push({ data: fileObj.data, address: offset })
    }

    try {
      const flashOptions: FlashOptions = {
        fileArray: fileArray,
        flashSize: "keep",
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          progressBars[fileIndex].value = ((written / total) * 100).toFixed(2)
        },
        calculateMD5Hash: (image): string => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)) as unknown as string,
      } as FlashOptions
      await esploader.writeFlash(flashOptions)
    } catch (e: any) {
      console.error(e)
      term.writeln(`Error: ${e.message}`)
    } finally {
      // Hide progress bars and show erase buttons
      for (let index = 1; index < fileTableRef.current!!.rows.length; index++) {
        fileTableRef.current!!.rows[index].cells[2].style.display = "none"
        fileTableRef.current!!.rows[index].cells[3].style.display = "initial"
      }
    }
  }

  useEffect(() => {
    addFileFunc()
  }, [])

  return (
    <div>
      <div ref={alertmsgRef} style={{ display: 'none' }}></div>
      <div>
        <h5>Connect device</h5>
        <select onChange={(e) => setBaudrates(e.target.value)} value={baudrates}>
          <option value="921600">921600</option>
          <option value="460800">460800</option>
          <option value="230400">230400</option>
          <option value="115200">115200</option>
        </select>
        <button onClick={connectDevice} disabled={!baudrates}>Connect</button>
      </div>
      <hr />
      <div>
        <h5>after connect</h5>
        <button onClick={traceFunc}>Copy trace</button>
        <button onClick={disconnectFunc}>Disconnect</button>
        <button onClick={eraseFunc} ref={erasButtonRef}>Eras</button>
      </div>
      <hr />
      <div>
        <table ref={fileTableRef}>
          <thead>
            <tr>
              <th>Flash Address</th>
              <th>File</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
        <button onClick={addFileFunc}>Add file</button>
        <button onClick={programFunc}>Program</button>
      </div>
      <hr />
      <div>
        <h5>Console</h5>
        <select onChange={(e) => setBaudratesConsole(e.target.value)} value={baudratesConsole}>
          <option value="115200">115200</option>
          <option value="74880">74880</option>
        </select>
        <button onClick={consoleStartFunc}>Start</button>
        <button onClick={consoleStopFunc}>Stop</button>
        <button onClick={resetFunc}>Reset</button>
      </div>
      <hr />
      <div ref={terminalRef}></div>
    </div>
  )
}

export default ESPToolComponent