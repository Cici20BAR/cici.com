
const express = require('express')
const morgan=require('morgan')
const fs = require('fs')
const path = require('path')
const cors=require("cors")

require('dotenv').config()
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
app.get("/api/persons",(req,res)=>{
    res.json(read_db().persons);
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
app.delete("/api/persons/:id",(req,res)=>{
    const db=read_db();
    const id=req.params.id;
    const exist=db.persons.find((p)=>p.id===id)
    if(!exist){
        res.status(404).end()
    }else{
        db.persons=db.persons.filter((p)=>p.id!==id)
        write_db(db)
        res.status(204);
    }
})
app.post("/api/persons",(req,res)=>{
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
    const db=read_db()
    const exists=db.persons.find((p)=>p.name.toLowerCase() === cleanName.toLowerCase())
    if  (exists) {
        return res.status(400).json({ error: "name must be unique" });
    }
    const newobj={        
        id: Math.random().toString(36).slice(2, 13),
            name: cleanName,
        number: cleanNumber
    }
    db.persons.push(newobj)
        write_db(db)
  res.json(newobj)      
})
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Serverul a pornit corect si asculta pe portul ${PORT}`);
});