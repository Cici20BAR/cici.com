
import express from 'express'
import morgan from 'morgan'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import Person from './model/schema_conn.js'

import 'dotenv/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app=express();
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);
});

app.use(express.json());
app.use(express.static('dist'));
app.use(morgan(':method :url :res[content-length]  :body'))
app.use(cors())
const DB_PATH=path.join(__dirname,"db.json");
const read_db=()=>JSON.parse(fs.readFileSync(DB_PATH,"utf-8"));
const write_db=(data)=>fs.writeFileSync(DB_PATH,JSON.stringify(data));
app.get("/api/persons", async (req,res,next)=>{
    try {
        const persons = await Person.find()
        res.json(persons)
    } catch (error) {
        next(error)
    }
})
app.get("/api/info",(req,res)=>{

    const count=read_db().persons.length;
    res.send(
        `<p>
        
        
        Info page</p>
        </p> there are ${count} persons in notebook</p>
        <p>${new Date()}</p>`

    )
})
app.get("/api/persons/:id",(req,res)=>{

    const id=req.params.id;
    const pers_found=read_db().persons.find((p)=>p.id==id);
    if(pers_found){
        res.json(pers_found)
    }else{
        res.statusMessage="no id"
        res.status(404).end()
    }
})
app.put("/api/persons/:id", async (req, res, next) => {
    try {
        const { name, number } = req.body;
        if (typeof name !== "string" || typeof number !== "string") {
            return res.status(400).json({ error: "name or number missing" });
        }

        const cleanName = name.trim();
        const cleanNumber = number.trim();

        if (!cleanName || !cleanNumber) {
            return res.status(400).json({ error: "name or number is empty" });
        }

        if (!/^\d[\d-]*$/.test(cleanNumber)) {
            return res.status(400).json({ error: "number must contain only digits and dashes" });
        }

        const updatedPerson = await Person.findByIdAndUpdate(
            req.params.id,
            { name: cleanName, number: cleanNumber },
            { new: true, runValidators: true }
        )

        if (!updatedPerson) {
            return res.status(404).json({ error: "person not found" });
        }

        return res.json(updatedPerson)
    } catch (error) {
        next(error)
    }
})
app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
})
app.post("/api/persons",async (req,res,next)=>{
    try {
        const{name,number}=req.body;
        if (typeof name !== "string" || typeof number !== "string") {
            return res.status(400).json({ error: "name or number missing" });
        }

        const cleanName = name.trim();
        const cleanNumber = number.trim();

        if (!cleanName || !cleanNumber) {
            return res.status(400).json({ error: "name or number is empty" });
        }

        if (!/^\d[\d-]*$/.test(cleanNumber)) {
            return res.status(400).json({ error: "number must contain only digits and dashes" });
        }
        const exists = await Person.findOne({ name: cleanName })
            .collation({ locale: 'en', strength: 2 })
        if (exists) {
            return res.status(400).json({ error: "name must be unique" });
        }
        const person = new Person({
            name: cleanName,
            number: cleanNumber,
        })

        const savedPerson = await person.save()
        return res.status(201).json(savedPerson)
    } catch (error) {
        next(error)
    }
})

app.use((error, req, res, next) => {
  console.error(error)

  if (res.headersSent) {
    return next(error)
  }

  const isMongooseClientError =
    error.name === 'ValidationError' || error.name === 'CastError'
  const requestedStatus = error.statusCode ?? error.status
  const status = isMongooseClientError
    ? 400
    : Number.isInteger(requestedStatus) && requestedStatus >= 400 && requestedStatus < 500
      ? requestedStatus
      : 500
  const message = status < 500 ? error.message : 'Internal server error'

  res.status(status).json({ error: message })
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Serverul a pornit corect si asculta pe portul ${PORT}`);
});