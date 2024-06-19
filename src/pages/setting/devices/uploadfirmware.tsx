import { useTranslation } from "react-i18next"
import { DropContainer, DropHereFile, FileDroped, FirewareContent, FirmwareContainer, FirmwareHeader, RowChildren, UploadButton } from "../../../style/components/firmwareuoload"
import DataTable, { TableColumn } from "react-data-table-component"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { FormEvent, useState } from "react"
import { Form, Modal } from "react-bootstrap"
import { FormBtn, FormFlexBtn, ModalHead } from "../../../style/style"
import { RiCloseLine, RiDragDropLine, RiFileCheckLine, RiFileUploadLine } from "react-icons/ri"
import { FileUploader } from "react-drag-drop-files"
import Swal from "sweetalert2"
import { CircularProgressbar } from 'react-circular-progressbar'
import { filesize } from "filesize"

export default function Uploadfirmware() {
  const { t } = useTranslation()
  const { searchQuery } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [show, setShow] = useState(false)
  const [file, setFile] = useState<File | undefined>(undefined)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [dragChang, setDragChang] = useState<boolean>(false)
  const [progress, setProgress] = useState(0)
  const [submit, setSubmit] = useState(false)
  const fileTypes = ["BIN"]

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setShow(false)
    setFile(undefined)
    setSubmit(false)
    setProgress(0)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('upload', blob as Blob)
    if (blob) {
      console.log(blob)
      setSubmit(true)
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
    setFile(files)
    if (files) {
      const reader = new FileReader()

      reader.onloadend = () => {
        // Create a Blob from the file's data
        if (reader.result) {
          // Create a Blob from the file's data
          const blob = new Blob([reader.result], { type: files.type })
          setBlob(blob)
        } else {
          console.error('Failed to read file as ArrayBuffer')
        }
      }

      reader.readAsArrayBuffer(files) // Read the file as an ArrayBuffer to create a Blob
    }
  }

  const handleDrag = (dragging: boolean) => {
    setDragChang(dragging)
    if (dragging) {
      setFile(undefined)
      setSubmit(false)
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
    <DropContainer $primary={file}>
      {
        file ?
          <FileDroped $primary={submit}>
            {submit ? <CircularProgressbar
              value={progress}
              text={`${progress}%`} /> : <RiFileCheckLine size={128} />}
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
        <UploadButton onClick={openModal}><RiFileUploadLine size={24} />{t('uploadButton')}</UploadButton>
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
