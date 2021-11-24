const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const PORT = process.env.PORT || 5000
const cors = require("cors")
app.use(cors({
    origin: "*"
}))

app.use(express.json())

const rooms = [
    {
        name: "Elite",
        seats: 100,
        amenities: "Wifi, AC, Projector",
        price: "10000/hr",
        roomId: "a123",
        bookingDetails: [{
            customerName: "test 1",
            date: new Date("2021-10-10"),
            start: "07:00",
            end: "10:00",
            status: "confirmed"
        }]
    },
    {
        name: "Premium",
        seats: 200,
        amenities: "Wifi, AC, Projector",
        price: "20000/hr",
        roomId: "def",
        bookingDetails: [{
            customerName: "test 2",
            date: new Date("2021-10-11"),
            start: "15:00",
            end: "17:00",
            status: "Payment Pending"
        }]
    }
]

// app.get("/", (req,res) => {
//     res.json("this app is running successfully")
// })

//create room
app.post("/create_room", (req, res) => {

    try {
        rooms.push({
            name: req.body.name,
            seats: req.body.seats,
            amenities: req.body.amenities,
            price: req.body.price,
            roomId: req.body.roomId,
            bookingDetails: [{}]
        })
    } catch (err) {
        console.log(err);
    }
    res.send("Room Created")
})



//book rooms
app.post("/book_room", (req, res, next) => {
    for (let i = 0; i < rooms.length; i++) {
        if (!(rooms[i].roomId === req.body.roomId)) {
            return res.status(400).send({ error: "Room does not exist" })
        }
        else {
            let booking = {
                customerName: req.body.name,
                date: new Date(req.body.date),
                start: req.body.start,
                end: req.body.end,
                status: "confirmed"
            }
            let result = undefined;
            rooms[i].bookingDetails.forEach((book) => {
                if (book.date.getTime() == booking.date.getTime() && book.start === booking.start) {
                    result = 0
                    console.log("in booking")
                }
                else {
                    result = 1
                    rooms[i].bookingDetails.push(booking)
                }
            })
            if (result)
                return res.status(200).send("Booking confirmed")
            else
                return res.status(400).send({ error: "Please select different time slot" })
        }
    }
})

//list customers

app.get("/list_customer", (req, res) => {

    let customerArray = []

    rooms.forEach((room) => {
        let customerObj = { roomName: room.name }

        room.bookingDetails.forEach((customer) => {
            customerObj.customerName = customer.customerName
            customerObj.date = customer.date
            customerObj.start = customer.start
            customerObj.end = customer.end

            customerArray.push(customerObj)
        })
    })
    res.send(customerArray)
})

//list room and booking details

app.get("/list_rooms", (req, res) => {
    res.send(rooms)
})

app.listen(PORT, () => {
    console.log(`this app is listening to ${PORT}`)
})