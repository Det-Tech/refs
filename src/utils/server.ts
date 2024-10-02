import { createClient } from "./supabase";

export const getUsers = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("users").select("name, hashed, fullName, parent_id");

  if (error || data === null || data.length === 0) {
    return [];
  }

  return data;
};

export const setUser = async (name: string, hashed: string, fullName: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.from("users").insert([
    {
      name: name,
      hashed: hashed,
      fullName: fullName 
    },
  ]);

  if (error || data === null) {
    return false;
  }

  return true;
};

export const deleteUser = async (id: number) => {
  const supabase = createClient();
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) return false;

  return true;
};
