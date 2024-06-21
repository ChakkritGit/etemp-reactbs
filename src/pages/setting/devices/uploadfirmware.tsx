import { useTranslation } from "react-i18next"
import { DropContainer, DropHereFile, FileDroped, FirewareContent, FirmwareContainer, FirmwareHeader, RowChildren, UploadButton } from "../../../style/components/firmwareuoload"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { FormEvent, useEffect, useState } from "react"
import { Form, Modal } from "react-bootstrap"
import { FormBtn, FormFlexBtn, ModalHead } from "../../../style/style"
import { RiCloseCircleLine, RiCloseLine, RiDragDropLine, RiFileCheckLine, RiFileUploadLine } from "react-icons/ri"
import { FileUploader } from "react-drag-drop-files"
import { CircularProgressbar } from 'react-circular-progressbar'
import { filesize } from "filesize"
import DataTable, { TableColumn } from "react-data-table-component"
import Swal from "sweetalert2"
import axios, { AxiosError } from "axios"
import { responseType } from "../../../types/response.type"
import ESPToolComponent from "./serial.port"

export default function Uploadfirmware() {
  const { t } = useTranslation()
  const { searchQuery, token } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [show, setShow] = useState(false)
  const [file, setFile] = useState<File | undefined>(undefined)
  const [dragChang, setDragChang] = useState<boolean>(false)
  const [progress, setProgress] = useState(0)
  const [submit, setSubmit] = useState(false)
  const [error, setError] = useState(false)
  const [_dataFiles, setDataFile] = useState<string[]>([])
  const fileTypes = ["BIN"]

  const fetchFiles = async () => {
    try {
      const response = await axios.get<responseType<string[]>>(`${import.meta.env.VITE_APP_API}/firmwares`, {
        headers: { authorization: `Bearer ${token}`, }
      })
      console.log(response.data.data)
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

  const columns: TableColumn<{ name: string, version: string }>[] = [
    {
      name: t('firmwareName'),
      cell: (items) => <span>{items.name}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('firmwareVersion'),
      cell: (items) => <span>{items.version}</span>,
      sortable: false,
      center: true
    },
  ]

  // Filter Data
  const filteredItems = [{ name: 'test', version: '1.0' }].filter(item => item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
        <DataTable
          responsive={true}
          columns={columns}
          data={filteredItems}
          paginationPerPage={10}
          pagination
        />
      </FirewareContent>

      <ESPToolComponent />

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
