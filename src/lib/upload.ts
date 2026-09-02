import { createClient } from "@/lib/supabase/client";

export async function uploadWeddingPhoto(file: File) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");
  const path = `${user.id}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("wedding-photos").upload(path, file);
  if (error) throw error;
  const {
    data: { publicUrl },
  } = supabase.storage.from("wedding-photos").getPublicUrl(path);
  return publicUrl;
}
