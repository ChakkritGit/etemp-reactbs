import { Container } from "react-bootstrap"
import { CardUserBody, CardUserHead, PaginitionContainer } from "../../style/style"
import { useTranslation } from "react-i18next"
import { ChangeEvent, useEffect, useState } from "react"
import CardUser from "../../components/users/cardUser"
import { usersType } from "../../types/user.type"
import Adduser from "./adduser"
import Paginition from "../../components/filter/paginition"
import { useSelector } from "react-redux"
import { DeviceStateStore, UserState, UtilsStateStore } from "../../types/redux.type"

export default function Permission() {
  const { t } = useTranslation()
  const { userDaata } = useSelector<DeviceStateStore, UserState>((state) => state.user)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [cardsPerPage, setCardsPerPage] = useState<number>(10)
  const [displayedCards, setDisplayedCards] = useState<usersType[]>(userDaata ? userDaata.slice(0, cardsPerPage) : [])
  const { searchQuery } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)

  // ส่วนของการค้นหาและเลื่อนหน้าการ์ด
  useEffect(() => {
    setCurrentPage(0)
    setDisplayedCards(userDaata ? userDaata.slice(0, cardsPerPage) : [])
    showPage(0, searchQuery)
  }, [searchQuery, userDaata, cardsPerPage])

  useEffect(() => {
    showPage(currentPage, searchQuery)
  }, [currentPage, userDaata, cardsPerPage])

  const showPage = (pageNumber: number, query: string = '') => {
    const startIndex = pageNumber * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    const filteredCards = userDaata ? (query ? userDaata.filter(card => [card.displayName, card.userName, card.userId].some(attr => attr.toLowerCase().includes(query.toLowerCase()))) : userDaata) : []
    const cardsToDisplay = filteredCards ? filteredCards.slice(startIndex, endIndex) : []
    setDisplayedCards(cardsToDisplay)
  }

  const changePage = (change: number) => {
    setCurrentPage(currentPage + change)
  }

  const displaySelectDevices = (event: ChangeEvent<HTMLSelectElement>) => {
    setCardsPerPage(Number(event.target.value))
  }
  // จบส่วนการ์ด

  return (
    <Container fluid>
      <CardUserHead>
        <h3>{t('sidePermission')}</h3>
        <Adduser pagestate={"add"} />
      </CardUserHead>
      <PaginitionContainer>
        <div></div>
        <Paginition
          currentPage={currentPage}
          cardsPerPage={cardsPerPage}
          changePage={changePage}
          displaySelectDevices={displaySelectDevices}
          displayedCards={displayedCards}
          userdata={userDaata}
        />
      </PaginitionContainer>
      <CardUserBody>
        {
          displayedCards.map((item, index) => (
            <CardUser
              key={item.userId}
              keyindex={index}
              userPic={item.userPic}
              displayName={item.displayName}
              userName={item.userName}
              userLevel={item.userLevel}
              userId={item.userId}
              hosId={item.ward.hosId}
              userStatus={item.userStatus}
              wardId={item.wardId}
            />
          ))
        }
      </CardUserBody>
    </Container >
  )
}
