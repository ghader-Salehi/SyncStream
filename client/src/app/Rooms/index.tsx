import { FunctionComponent, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button/Button";
import CircularProgress from '@mui/material/CircularProgress';

import { getRooms } from "api/room";

interface RoomsProps {}
interface RoomCardProps {
  id: string;
  name: string;
  title: string;
}

interface Room {
  adminId: string;
  id: string;
  name: string;
  title: string;
  type: string;
}

const RoomCard = ({ name, title, id }: RoomCardProps) => {
  const navigate = useNavigate();
  return (
    <Card sx={{ minWidth: 275 }} style={{ margin: "8px 16px" }}>
      <CardContent>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          {name}
        </Typography>
        <Typography sx={{ fontSize: 16, margin: 4 }} component="div">
          {title}
        </Typography>
        <div style={{ width: "100%", marginTop: 16 }}>
          <Button
            onClick={() => navigate(`/session/${id}`)}
            style={{ width: "100%", fontWeight: "bold" }}
            size="small"
          >
            Enter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Rooms: FunctionComponent<RoomsProps> = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const handleGetRoomsList = async () => {
    try {
      const res = await getRooms();
      console.log(res.data.allRooms);
      setRooms(res.data.allRooms);
    } catch (error) {
      console.log("🚀 ~ file: index.tsx:15 ~ handleGetRoomsList ~ error:", error);
    }
  };

  useEffect(() => {
    handleGetRoomsList();
  }, []);

  return (
    <div>
      <Typography sx={{ fontSize: 24 }} style={{ margin: 24 }}>
        Permanent Rooms
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {rooms.map((r, i) => {
          return <RoomCard key={i} id={r.id} name={r.name} title={r.title} />;
        })}
        {rooms.length === 0 && (<div><CircularProgress /></div>)}
      </div>
    </div>
  );
};

export default Rooms;
