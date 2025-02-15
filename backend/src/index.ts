import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middlewate";
import cors from "cors";
import { JWT_SECRET } from "./config";
import prisma from "./db/connectDb";
import { RoomSchema, SignInSchema, SignUpSchema } from "./types/schema";
import { WebSocket, WebSocketServer } from 'ws';
import { createServer } from "http";


const app = express();

const server = createServer(app);

app.use(express.json());
app.use(cors({ origin: "https://draw-app-trial.vercel.app" }));

app.post("/signup", async (req, res) => {
  try {
    const { data, error } = SignUpSchema.safeParse(req.body);
    if (error) {
      res.status(403).json({
        success: false,
        message: error.issues.map((err) => err.message),
      });
      return;
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data?.email,
      },
    });

    if (existingUser) {
      res.status(403).json({ success: false, message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });

    res.status(200).json({ success: true, message: "Sign up successfull" });
    return;
  } catch (error) {
    console.log("Error in sign up", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { data, error } = SignInSchema.safeParse(req.body);
    if (error) {
      res.status(403).json({
        success: false,
        message: error.issues.map((err) => err.message),
      });
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        email: data?.email,
      },
    });

    if (!user) {
      res.status(403).json({ success: false, message: "User does not exists" });
      return;
    }

    const hashedPassword = await bcrypt.compare(data.password, user.password);
    if (!hashedPassword) {
      res.status(403).json({ success: false, message: "Incorrect Password" });
      return;
    }

    const token = jwt.sign({ user }, JWT_SECRET);
    res
      .status(200)
      .json({ success: true, message: "Sign in successfull", token });
    return;
  } catch (error) {
    console.log("Error in sign in", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
});

app.post("/room", authMiddleware, async (req, res) => {
  try {
    const { data, error } = RoomSchema.safeParse(req.body);
    if (error) {
      res.status(403).json({
        success: false,
        message: error.issues.map((err) => err.message),
      });
      return;
    }
    const userId = req.user.id;
    const room = await prisma.room.create({
      data: {
        slug: data.roomName,
        adminId: userId,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Room created successfully ", room });
  } catch (error) {
    console.log("Error in creating room", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
});

app.get("/chat/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const messages = await prisma.chat.findMany({
      where: {
        roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log("Error in geting messages", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
});

app.get("/room", authMiddleware, async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.log("Error in gettin room", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
});

app.delete("/room/:roomId", authMiddleware, async (req, res) => {
  const roomId = req.params.roomId;
  try {
    await prisma.$transaction([
      prisma.chat.deleteMany({ where: { roomId } }),
      prisma.room.delete({ where: { id: roomId } }),
    ]);

    res.status(200).json({ success: true, message: "Room deleted" });
  } catch (error) {
    console.log("Error in clearing canvas", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
});

app.delete("/canvas/clear/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  try {
    await prisma.chat.deleteMany({
      where: {
        roomId,
      },
    });
    res.status(200).json({ success: true, message: "canvas cleared" });
  } catch (error) {
    console.log("Error in clearing canvas", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
});


const wss = new WebSocketServer({ server });

interface User {
    ws: WebSocket;
    rooms: string[];
    userId: string;
};

const users: User[] = [];

const checkUser = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(typeof decoded == 'string'){
            return null;
        };

        if(!decoded || !decoded.user){
            return null;
        }
        return decoded.user;
    } catch (error) {
        console.log("Error in decoding ws user", error)
        return null;
    }
};

wss.on('connection', function connection(ws, request){
    console.log("Ws server at port: 8080")
    const url = request.url;
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const user = checkUser(token);
    if(!user){
        console.log("No user found")
        ws.close();
        return null;
    }
    const userId = user.id

    users.push({
        userId,
        rooms : [],
        ws
    });



    ws.on('message', async function message(data){
        let parsedData;
        if(typeof data !== 'string'){
            parsedData = JSON.parse(data.toString());
        } else{
            parsedData = JSON.parse(data);
        }

        if(parsedData.type === "join_room"){
            const user = users.find(x => x.ws === ws);
            user?.rooms.push(parsedData.roomId);
        };

        if(parsedData.type === 'leave_room'){
            const user = users.find(x => x.ws == ws);
            if(!user){
                return;
            }
            user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
        }

        if(parsedData.type === 'draw'){
            const roomId = parsedData.roomId;
            const message = parsedData.shape;

            await prisma.chat.create({
                data: {
                    roomId,
                    message,
                    userId
                }
            });

            const sendUser = users.filter((user) => user.userId !== userId)

            sendUser.forEach(user => {
                user.ws.send(JSON.stringify({
                    type: 'draw',
                    message: message,
                    roomId
                }))
            });
        };

        if(parsedData.type === "undo"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            const sendUser = users.filter((user) => user.userId !== userId)


            sendUser.forEach(user => {
                user.ws.send(JSON.stringify({
                    type: 'undo',
                }))
            });    
        }

        if(parsedData.type === "redo"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;
            const sendUser = users.filter((user) => user.userId !== userId)

            sendUser.forEach(user => {
                user.ws.send(JSON.stringify({
                    type: 'redo',
                }))
            });    
        }
    })
})


server.listen(8080, () => {
  console.log("Server running on port 8080");
});