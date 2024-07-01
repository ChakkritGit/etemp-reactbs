import { Form, Modal, Row } from "react-bootstrap"
import { FormBtn, FormFlexBtn, ModalHead } from "../../style/style"
import { RiAddLine, RiCloseLine, RiEditLine } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import { FormEvent, useState } from "react"
import { AddWarrantyButton } from "../../style/components/warranty.styled"
import { warrantyType } from "../../types/warranty.type"

interface AddWarrantyPropsType {
  pagestate: string,
  warData?: warrantyType
}

export default function Addwarranty(warProps: AddWarrantyPropsType) {
  const { pagestate } = warProps
  const { t } = useTranslation()
  const [show, setShowe] = useState(false)

  const openModal = () => {
    setShowe(true)
  }

  const closeModal = () => {
    setShowe(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  const handleSubmitEdit = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <>
      {
        pagestate == 'add' ?
          <AddWarrantyButton onClick={openModal}>
            add
            <RiAddLine />
          </AddWarrantyButton>
          :
          <AddWarrantyButton $primary onClick={openModal} >
            <RiEditLine />
          </AddWarrantyButton>
      }
      <Modal size='lg' show={show} onHide={closeModal}>
        <Modal.Header>
          {/* {JSON.stringify(formdata)} */}
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('addHos')
                  :
                  t('editHos')
              }
            </strong>
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitEdit}>
          <Modal.Body>
            <Row>

            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('saveButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
