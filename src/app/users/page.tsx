import { UserType } from '@/types/UserTypes'
import React from 'react'
import Table from '../components/Table'
import { getUsers } from '../service/UsersService'

const UsersPage = async () => {
    const users = await getUsers()
    const columns = Object.keys(users[0]);
    const rows = users.map((user: UserType) => Object.values(user));
    
  return (
    <div>
       <h1>UsersPage</h1>
        <Table columns={columns} rows={rows}/>
    </div>
    
  )
}

export default UsersPage