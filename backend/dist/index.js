"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middlewate_1 = require("./middlewate");
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const connectDb_1 = __importDefault(require("./db/connectDb"));
const schema_1 = require("./types/schema");
const ws_1 = require("ws");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = schema_1.SignUpSchema.safeParse(req.body);
        if (error) {
            res.status(403).json({
                success: false,
                message: error.issues.map((err) => err.message),
            });
            return;
        }
        const existingUser = yield connectDb_1.default.user.findUnique({
            where: {
                email: data === null || data === void 0 ? void 0 : data.email,
            },
        });
        if (existingUser) {
            res.status(403).json({ success: false, message: "User already exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
        yield connectDb_1.default.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
            },
        });
        res.status(200).json({ success: true, message: "Sign up successfull" });
        return;
    }
    catch (error) {
        console.log("Error in sign up", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = schema_1.SignInSchema.safeParse(req.body);
        if (error) {
            res.status(403).json({
                success: false,
                message: error.issues.map((err) => err.message),
            });
            return;
        }
        const user = yield connectDb_1.default.user.findUnique({
            where: {
                email: data === null || data === void 0 ? void 0 : data.email,
            },
        });
        if (!user) {
            res.status(403).json({ success: false, message: "User does not exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.compare(data.password, user.password);
        if (!hashedPassword) {
            res.status(403).json({ success: false, message: "Incorrect Password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ user }, config_1.JWT_SECRET);
        res
            .status(200)
            .json({ success: true, message: "Sign in successfull", token });
        return;
    }
    catch (error) {
        console.log("Error in sign in", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
    }
}));
app.post("/room", middlewate_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = schema_1.RoomSchema.safeParse(req.body);
        if (error) {
            res.status(403).json({
                success: false,
                message: error.issues.map((err) => err.message),
            });
            return;
        }
        const userId = req.user.id;
        const room = yield connectDb_1.default.room.create({
            data: {
                slug: data.roomName,
                adminId: userId,
            },
        });
        res
            .status(200)
            .json({ success: true, message: "Room created successfully ", room });
    }
    catch (error) {
        console.log("Error in creating room", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
    }
}));
app.get("/chat/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.params.roomId;
        const messages = yield connectDb_1.default.chat.findMany({
            where: {
                roomId,
            },
            orderBy: {
                id: "desc",
            },
            take: 50,
        });
        res.status(200).json({ success: true, messages });
    }
    catch (error) {
        console.log("Error in geting messages", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
    }
}));
app.get("/room", middlewate_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield connectDb_1.default.room.findMany();
        res.status(200).json({ success: true, rooms });
    }
    catch (error) {
        console.log("Error in gettin room", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
    }
}));
app.delete("/room/:roomId", middlewate_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = req.params.roomId;
    try {
        yield connectDb_1.default.$transaction([
            connectDb_1.default.chat.deleteMany({ where: { roomId } }),
            connectDb_1.default.room.delete({ where: { id: roomId } }),
        ]);
        res.status(200).json({ success: true, message: "Room deleted" });
    }
    catch (error) {
        console.log("Error in clearing canvas", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
    }
}));
app.delete("/canvas/clear/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = req.params.roomId;
    try {
        yield connectDb_1.default.chat.deleteMany({
            where: {
                roomId,
            },
        });
        res.status(200).json({ success: true, message: "canvas cleared" });
    }
    catch (error) {
        console.log("Error in clearing canvas", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
    }
}));
const wss = new ws_1.WebSocketServer({ port: 8080 });
;
const users = [];
const checkUser = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (typeof decoded == 'string') {
            return null;
        }
        ;
        if (!decoded || !decoded.user) {
            return null;
        }
        return decoded.user;
    }
    catch (error) {
        console.log("Error in decoding ws user", error);
        return null;
    }
};
wss.on('connection', function connection(ws, request) {
    console.log("Ws server at port: 8080");
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const user = checkUser(token);
    if (!user) {
        console.log("No user found");
        ws.close();
        return null;
    }
    const userId = user.id;
    users.push({
        userId,
        rooms: [],
        ws
    });
    ws.on('message', function message(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let parsedData;
            if (typeof data !== 'string') {
                parsedData = JSON.parse(data.toString());
            }
            else {
                parsedData = JSON.parse(data);
            }
            if (parsedData.type === "join_room") {
                const user = users.find(x => x.ws === ws);
                user === null || user === void 0 ? void 0 : user.rooms.push(parsedData.roomId);
            }
            ;
            if (parsedData.type === 'leave_room') {
                const user = users.find(x => x.ws == ws);
                if (!user) {
                    return;
                }
                user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
            }
            if (parsedData.type === 'draw') {
                const roomId = parsedData.roomId;
                const message = parsedData.shape;
                yield connectDb_1.default.chat.create({
                    data: {
                        roomId,
                        message,
                        userId
                    }
                });
                const sendUser = users.filter((user) => user.userId !== userId);
                sendUser.forEach(user => {
                    user.ws.send(JSON.stringify({
                        type: 'draw',
                        message: message,
                        roomId
                    }));
                });
            }
            ;
            if (parsedData.type === "undo") {
                const roomId = parsedData.roomId;
                const message = parsedData.message;
                const sendUser = users.filter((user) => user.userId !== userId);
                sendUser.forEach(user => {
                    user.ws.send(JSON.stringify({
                        type: 'undo',
                    }));
                });
            }
            if (parsedData.type === "redo") {
                const roomId = parsedData.roomId;
                const message = parsedData.message;
                const sendUser = users.filter((user) => user.userId !== userId);
                sendUser.forEach(user => {
                    user.ws.send(JSON.stringify({
                        type: 'redo',
                    }));
                });
            }
        });
    });
});
app.listen(5000, () => {
    console.log("hello form server 5000");
});
