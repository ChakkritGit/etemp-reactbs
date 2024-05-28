import { FormEvent, useEffect, useState } from 'react'
import {
  AddrepairBtn, Checkboxbsoveride, FormBtn, FormFlexBtn,
  FormTitleFlex, ModalHead
} from '../../style/style'
import {
  RiAddLine, RiCloseLine, RiDropboxLine, RiEditLine,
  RiInformationLine, RiUser3Line
} from 'react-icons/ri'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import WardDropdown from '../../components/dropdown/wardDropdown'
import Showsn from './showsn'
import { repairType } from '../../types/repair.type'
import axios from 'axios'
import Swal from 'sweetalert2'
import { localtoken } from '../../authen/localdata'

type addrepairtype = {
  pagestate: string,
  fetchdata: () => void,
  devdata: repairType
}

export default function Addrepair(addrepair: addrepairtype) {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [repairData, setRepairdata] = useState({
    repair_info: addrepair.devdata.repairInfo || localStorage.getItem('displayname') as string,
    repair_location: addrepair.devdata.repairLocation || '',
    tel_number: addrepair.devdata.telePhone || '',
    ward: addrepair.devdata.ward || '',
    dev_id: addrepair.devdata.devId || '',
    warranty_status: addrepair.devdata.warrantyStatus || '',
    comment: addrepair.devdata.comment || '',
    repair_details: addrepair.devdata.repairDetails || '',
    repair_status: '1'
  })

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    setShow(false)
  }

  useEffect(() => {
    console.table(repairData)
  }, [repairData])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await axios
      .post(`${import.meta.env.VITE_APP_API}/repair`, repairData, {
        headers: { authorization: `Bearer ${localtoken}` }
      })
      .then((response) => {
        if (response.data.status === 200) {
          setShow(false)
          Swal.fire({
            title: t('alert_header_Success'),
            text: response.data.msg,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            addrepair.fetchdata()
            setRepairdata({
              repair_info: '',
              repair_location: '',
              tel_number: '',
              ward: '',
              dev_id: '',
              warranty_status: '',
              comment: '',
              repair_details: '',
              repair_status: '1'
            })
          })
        } else {
          Swal.fire({
            title: t('alert_header_Error'),
            text: response.data.msg,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      })
      .catch((error) => {
        console.error(error)
        if (error.response.status === 404) {
          Swal.fire({
            title: t('alert_header_Error'),
            text: error.response.msg,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      })
  }

  const handleSubmitEdit = async (e: FormEvent) => {
    e.preventDefault()
    await axios
      .put(`${import.meta.env.VITE_APP_API}/repair/${addrepair.devdata.repairId}`, repairData, {
        headers: { authorization: `Bearer ${localtoken}` }
      })
      .then((response) => {
        if (response.data.status === 200) {
          setShow(false)
          Swal.fire({
            title: t('alert_header_Success'),
            text: response.data.msg,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            addrepair.fetchdata()
          })
        } else {
          Swal.fire({
            title: t('alert_header_Error'),
            text: response.data.msg,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      })
      .catch((error) => {
        console.error(error)
        if (error.response.status === 404) {
          Swal.fire({
            title: t('alert_header_Error'),
            text: error.response.msg,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      })
  }

  const setValuestate = (value: string) => {
    setRepairdata({ ...repairData, ward: value })
  }

  const handleCheckboxChange = (value: string) => {
    setRepairdata({ ...repairData, warranty_status: value })
  }

  return (
    <>
      {
        addrepair.pagestate === "add" ?
          <AddrepairBtn onClick={openmodal}>
            {t('repairtitle')}
            <RiAddLine />
          </AddrepairBtn>
          :
          <AddrepairBtn onClick={openmodal} style={{ width: '30px', height: '30px' }}>
            <RiEditLine />
          </AddrepairBtn>
      }

      <Modal
        size={addrepair.pagestate === "edit" ? "lg" : 'lg'}
        show={show}
        onHide={closemodal}>
        <Modal.Header>
          {/* <pre style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(repairData)}
          </pre> */}
          <ModalHead>
            <strong>
              {
                addrepair.pagestate === "add" ?
                  t('repairtitle')
                  :
                  t('edit')
              }
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={addrepair.pagestate === "add" ? handleSubmit : handleSubmitEdit}>
          <Modal.Body>
            <Row>
              <Col lg={6}>
                <FormTitleFlex><RiUser3Line />{t('sectionpersonal')}</FormTitleFlex>
                <Form.Group className="mb-3" >
                  <Form.Label>{t('field_displayname')}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    autoComplete='off'
                    value={repairData.repair_info}
                    onChange={(e) => setRepairdata({ ...repairData, repair_info: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label>{t('address')}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    autoComplete='off'
                    value={repairData.repair_location}
                    onChange={(e) => setRepairdata({ ...repairData, repair_location: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label>{t('telnumber')}</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder=""
                    autoComplete='off'
                    value={repairData.tel_number}
                    onChange={(e) => setRepairdata({ ...repairData, tel_number: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label>{t('tab_ward')}</Form.Label>
                  <WardDropdown
                    setState_ward={setValuestate}
                    Hosid={localStorage.getItem('hosid') as string}
                    Group_ID={localStorage.getItem('groupid') as string}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <FormTitleFlex><RiDropboxLine />{t('sectionproduct')}</FormTitleFlex>
                <Form.Group className="mb-3" >
                  <Form.Label>{t('tb_dev_sn')}</Form.Label>
                  <Showsn
                    repairData={repairData}
                    setRepairdata={setRepairdata}
                    dev_idkey={addrepair.devdata.devId}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Checkboxbsoveride>
                    <Form.Check
                      inline
                      label={t('aftersale')}
                      className='int-ch-b'
                      type="checkbox"
                      checked={repairData.warranty_status === "1"}
                      onChange={() => handleCheckboxChange("1")}
                    />
                    <Form.Check
                      inline
                      label={t('expired')}
                      className='int-ch-b'
                      type="checkbox"
                      checked={repairData.warranty_status === "2"}
                      onChange={() => handleCheckboxChange("2")}
                    />
                    <Form.Check
                      inline
                      label={t('ma')}
                      className='int-ch-b'
                      type="checkbox"
                      checked={repairData.warranty_status === "3"}
                      onChange={() => handleCheckboxChange("3")}
                    />
                    <Form.Check
                      inline
                      label={t('etc')}
                      className='int-ch-b'
                      type="checkbox"
                      checked={repairData.warranty_status === "4"}
                      onChange={() => handleCheckboxChange("4")}
                    />
                  </Checkboxbsoveride>
                </Form.Group>
                {repairData.warranty_status === "4" ?
                  <Form.Group className="mb-3" >
                    <Form.Label>{t('detailsExpand')}</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder=""
                      autoComplete='off'
                      rows={6}
                      value={repairData.comment}
                      onChange={(e) => setRepairdata({ ...repairData, comment: e.target.value })}
                    />
                  </Form.Group>
                  :
                  ""
                }
              </Col>
              <Col lg={12}>
                <FormTitleFlex><RiInformationLine />{t('details')}</FormTitleFlex>
                <Form.Group className="mb-3" >
                  <Form.Label>{t('details')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder=""
                    autoComplete='off'
                    rows={6}
                    value={repairData.repair_details}
                    onChange={(e) => setRepairdata({ ...repairData, repair_details: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('form_btn_save')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal >
    </>
  )
}
