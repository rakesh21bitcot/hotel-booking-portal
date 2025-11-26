import RoomPage from '@/modules/rooms';
interface PageProps {
  params: Promise<{ id: string }>
}
const Room = ({ params }: PageProps) => {
  
  return (
   <RoomPage params={params} />
  )
}

export default Room;