import { useTranslation } from "react-i18next"
import { DropContainer, DropHereFile, FileDroped, FileList, FirewareContent, FirmwareContainer, FirmwareHeader, ProgressBar, RowChildren, UploadButton } from "../../../style/components/firmwareuoload"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { FormEvent, useEffect, useRef, useState } from "react"
import { Form, Modal } from "react-bootstrap"
import { FormBtn, FormFlexBtn, ModalHead } from "../../../style/style"
import { RiCloseCircleLine, RiCloseLine, RiDownloadCloud2Line, RiDragDropLine, RiFileCheckLine, RiFileUploadLine } from "react-icons/ri"
import { FileUploader } from "react-drag-drop-files"
import { CircularProgressbar } from 'react-circular-progressbar'
import { filesize } from "filesize"
import Swal from "sweetalert2"
import axios, { AxiosError } from "axios"
import { responseType } from "../../../types/response.type"
import BinIco from "../../../assets/images/bin-icon.png"
import { Terminal } from "xterm"
import { ESPLoader, FlashOptions, LoaderOptions, Transport } from "esptool-js"
import CryptoJS from "crypto-js"

const term = new Terminal({ cols: 80, rows: 40 })
term.options = {
  fontSize: 12,
  fontFamily: 'Courier New',
  cursorStyle: 'block',
  theme: {
    background: '#000'
  }
}

const filters = [
  { usbVendorId: 0x10c4, usbProductId: 0xea60 }
]

let device: SerialPort
let esploader: ESPLoader
let transport: Transport

export default function Uploadfirmware() {
  const { t } = useTranslation()
  const { searchQuery, token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [show, setShow] = useState(false)
  const [showConsole, setShowConsole] = useState(false)
  const [file, setFile] = useState<File | undefined>(undefined)
  const [dragChang, setDragChang] = useState<boolean>(false)
  const [progress, setProgress] = useState(0)
  const [submit, setSubmit] = useState(false)
  const [error, setError] = useState(false)
  const [dataFiles, setDataFile] = useState<string[]>([])
  const [fileData, setFileData] = useState<string | ArrayBuffer | null | undefined>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [flashProgress, setFlashProgress] = useState('0')
  const fileTypes = ["BIN"]

  useEffect(() => {
    if (terminalRef.current && showConsole) {
      term.open(terminalRef.current)
    }
  }, [showConsole])

  const fetchFiles = async () => {
    try {
      const response = await axios.get<responseType<string[]>>(`${import.meta.env.VITE_APP_API}/firmwares`, {
        headers: { authorization: `Bearer ${token}`, }
      })
      setDataFile(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {

      } else {

      }
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const openModalConsole = () => {
    setShowConsole(true)
  }

  const closeModalConsole = async () => {
    setShowConsole(false)
    await cleanUp()
  }

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setFile(undefined)
    setSubmit(false)
    setError(false)
    setProgress(0)
    setShow(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('fileupload', file as Blob)
    if (file) {
      try {
        setSubmit(true)
        const response = await axios.post<responseType<string>>(`${import.meta.env.VITE_APP_API}/firmwares`, formData, {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }, onUploadProgress: (progressEvent) => {
            const { progress } = progressEvent
            setProgress(Number(progress) * 100)
          }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        closeModal()
      } catch (error) {
        if (error instanceof AxiosError) {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
          setError(true)
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: "Unknown Error",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
          setError(true)
        }
      }
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('selectedFile'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const handleChange = (files: File) => {
    console.log(files)
    if (files) {
      setFile(undefined)
      setSubmit(false)
      setError(false)
      setFile(files)
    }
  }

  const handleDrag = (dragging: boolean) => {
    setDragChang(dragging)
    if (dragging) {
      setFile(undefined)
      setSubmit(false)
      setError(false)
    }
  }

  const handleError = (_error: string) => {
    Swal.fire({
      title: t('alertHeaderError'),
      text: t('uploadLabelNotSupport'),
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    })
  }

  // Filter Data
  const filteredItems = dataFiles.filter(item => item && item.toLowerCase().includes(searchQuery.toLowerCase()))

  const UploadJSXStyle = () => (
    <DropContainer $primary={file} $error={error}>
      {
        file ?
          <FileDroped $primary={submit} $error={error}>
            {submit ?
              error ?
                <RiCloseCircleLine />
                :
                <CircularProgressbar
                  value={progress}
                  text={`${progress.toFixed()}%`} />
              :
              <RiFileCheckLine size={128} />}
            <div>
              <span>{file?.name}</span>
              <span>{filesize(file?.size, { standard: "jedec" })}</span>
            </div>
          </FileDroped>
          :
          !dragChang ? <DropHereFile>
            <RiDragDropLine size={128} />
            <span>{t('uploadLabel')}</span>
          </DropHereFile> : <></>
      }
    </DropContainer>
  )

  const downloadFw = async (fileName: string) => {
    try {
      const response = await axios.get<Blob>(`${import.meta.env.VITE_APP_API}/firmware/${fileName}`, {
        headers: { authorization: `Bearer ${token}`, },
        responseType: 'blob'
      })

      const file = new File([response.data], 'firmware.bin', { type: 'application/octet-stream' }); // สร้าง File object

      const reader = new FileReader()

      reader.onload = (ev: ProgressEvent<FileReader>) => {
        setFileData(ev.target?.result)
      }

      reader.readAsBinaryString(file)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error('Uknown error: ', error)
      }
    } finally {
      openModalConsole()
    }
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

  useEffect(() => {
    if (fileData !== null) {
      programFunc()
    }
  }, [fileData])

  const programFunc = async () => {
    if (!device) {
      device = await navigator.serial.requestPort({ filters })
      transport = new Transport(device, true)
    }

    try {
      const flashOptions = {
        transport,
        baudrate: 115200,
        terminal: espLoaderTerminal,
      } as LoaderOptions
      esploader = new ESPLoader(flashOptions)

      await esploader.main()

      // Temporarily broken
      // await esploader.flashId()
    } catch (e: any) {
      console.error(e)
      cleanUp()
      term.writeln(`Error: ${e.message}`)
    }

    const fileArray = []
    const offset = 0x1000

    if (fileData) {
      fileArray.push({ data: fileData, address: offset })
    } else {
      console.error('No file data available')
      return
    }

    try {
      const flashOptions: FlashOptions = {
        fileArray: fileArray,
        flashSize: "keep",
        eraseAll: false,
        compress: true,
        reportProgress: (_fileIndex, written, total) => {
          setFlashProgress(((written / total) * 100).toFixed(2))
        },
        calculateMD5Hash: (image): string => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)) as unknown as string,
      } as FlashOptions
      await esploader.writeFlash(flashOptions)
    } catch (e: any) {
      console.error(e)
      term.writeln(`Error: ${e.message}`)
    } finally {
      await cleanUp()
    }
  }

  const cleanUp = async () => {
    if (transport) await transport.disconnect()
      setFileData(null)
    device = null as unknown as SerialPort
    transport = null as unknown as Transport
  }

  return (
    <FirmwareContainer>
      <FirmwareHeader>
        <h3>{t('titleFirmware')}</h3>
        <div>
          <UploadButton onClick={openModal}>
            <RiFileUploadLine size={24} />
            {t('uploadButton')}
          </UploadButton>
        </div>
      </FirmwareHeader>
      <FirewareContent>
        {
          filteredItems && filteredItems.map((items, index) => (
            <FileList key={index}>
              <div>
                <img src={BinIco} alt="Icon" />
                <span>{items}</span>
              </div>
              <button onClick={() => downloadFw(items)}>
                <RiDownloadCloud2Line size={24} />
              </button>
            </FileList>
          ))
        }
      </FirewareContent>

      <Modal size={"xl"} show={showConsole} onHide={closeModalConsole}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('uploadButton')}
            </strong>
            {/* <pre>{JSON.stringify(file, null, 2)}</pre> */}
            <button onClick={closeModalConsole}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <ProgressBar $primary={flashProgress} />
            <div ref={terminalRef} />
          </Modal.Body>
        </Form>
      </Modal>

      <Modal size={"lg"} show={show} onHide={closeModal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('uploadButton')}
            </strong>
            {/* <pre>{JSON.stringify(file, null, 2)}</pre> */}
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <RowChildren>
              <FileUploader
                handleChange={handleChange}
                onTypeError={handleError}
                name={file?.name}
                types={fileTypes}
                label={t('uploadLabel')}
                children={<UploadJSXStyle />}
                dropMessageStyle={{ backgroundColor: 'var(--main-color-f2)' }}
                onDraggingStateChange={handleDrag} />
            </RowChildren>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('uploadButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </FirmwareContainer>
  )
}
