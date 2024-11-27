import { createClient } from "./supabase"

export const getUser = async (name: string, hashed: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("users")
    .select("id, name, hashed, fullName, parent_id, sharedList")
    .eq("name", name)
    .eq("hashed", hashed)
    .single()

  if (error || data === null) {
    return null
  }

  return data
}

export const getUsers = async () => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("users")
    .select("id, name, hashed, fullName, parent_id, sharedList")

  if (error || data === null || data.length === 0) {
    return []
  }

  return data
}

export const addUser = async (
  name: string,
  hashed: string,
  fullName: string
) => {
  console.log("server addUser", name)
  const supabase = createClient()
  const user = await getUser(name, hashed)
  const users = await getUsers();
  console.log("server addUser", user)
  console.log("server addUser", users)
  if (user) return user

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name: name,
        hashed: hashed,
        fullName: fullName,
      },
    ])
    .select("id, name, hashed, fullName, parent_id, sharedList")
    .single()

  if (error || data === null) {
    return null
  }

  return data
}

export const deleteUser = async (id: number) => {
  const supabase = createClient()
  const { error } = await supabase.from("users").delete().eq("id", id)

  if (error) return false

  return true
}

export const setSharedList = async (id: number, sharedList: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("users")
    .update({
      sharedList: sharedList,
    })
    .eq("id", id)
    .select("sharedList")
    .single()

  if (error || data === null) {
    return null
  }

  return data
}
