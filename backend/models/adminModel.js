const db=require('../config/db')

const TABLE ='admin'

const Admin={
    async create(adminData){
        const [admin]=await db(TABLE).insert(adminData).returning("*")
        return admin
    },

    async findByEmail(email){
        const admin=await db(TABLE).where({email}).first()
        return admin
    }

    
}

module.exports=Admin;