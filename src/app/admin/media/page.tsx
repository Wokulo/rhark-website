"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

export default function AdminMediaPage() {
  const supabase = createClient();

  const [images, setImages] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchImages() {
    const { data, error } = await supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setImages(data || []);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  async function uploadImage() {
    if (!file || !title) {
      setMessage("Title and image are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const fileName = `rhark-media/${Date.now()}-${file.name}`;

      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("Gallery")
        .upload(fileName, file);

      if (uploadError) throw uploadError;


      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("Gallery")
        .getPublicUrl(fileName);


      // Save database record
      const { error: insertError } = await supabase
        .from("media_library")
        .insert({
          name: title,
          url: publicUrl,
          type: file.type,
          size: file.size,
          folder: category,
          alt_text: description,
        } as any);


      if (insertError) throw insertError;


      setMessage("Image uploaded successfully");

      setTitle("");
      setDescription("");
      setFile(null);

      fetchImages();

    } catch (error:any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }


  async function deleteImage(id:string, url:string) {

   await supabase.storage
     .from("Gallery")
     .remove([url.split("/").pop() || ""]);

   const { error } = await supabase
     .from("media_library")
     .delete()
     .eq("id", id);

  if(!error){
    fetchImages();
  }
}

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Media Gallery
        </h1>

        <p className="text-sm text-neutral-500">
          Upload and manage RHARK images
        </p>
      </div>


      {message && (
        <div className="mb-5 rounded-lg bg-neutral-100 p-4">
          {message}
        </div>
      )}


      <div className="rounded-xl border bg-white p-6 mb-8">

        <h2 className="font-semibold mb-4">
          Upload New Image
        </h2>


        <input
          type="text"
          placeholder="Image title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="border rounded-lg p-2 w-full mb-3"
        />


        <textarea
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="border rounded-lg p-2 w-full mb-3"
        />


        <select
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
          className="border rounded-lg p-2 w-full mb-3"
        >
          <option value="general">
            General
          </option>

          <option value="events">
            Events
          </option>

          <option value="projects">
            Projects
          </option>

          <option value="campaigns">
            Campaigns
          </option>
        </select>


        <input
          type="file"
          accept="image/*"
          onChange={(e)=>setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />


        <button
          onClick={uploadImage}
          disabled={loading}
          className="flex items-center gap-2 bg-primary-500 text-white px-5 py-2 rounded-lg"
        >

          {
            loading ?
            <Loader2 className="animate-spin" size={18}/>
            :
            <Upload size={18}/>
          }

          Upload Image

        </button>

      </div>



      <div className="grid md:grid-cols-3 gap-5">

        {images.map((img)=>(

          <div
            key={img.id}
            className="border rounded-xl overflow-hidden bg-white"
          >

           <img
               src={img.url}
               className="w-full h-48 object-cover"
             />

            <div className="p-4">
              <h3 className="font-semibold">{img.name}</h3>
              <p className="text-sm text-neutral-500">{img.alt_text}</p>
              <button
               onClick={()=>deleteImage(img.id, img.url)}
                className="mt-3 flex items-center gap-2 text-red-600"
              >

                <Trash2 size={16}/>
                Delete

              </button>

            </div>

          </div>

        ))}


        {images.length===0 && (
          <div className="text-neutral-400">
            <ImageIcon/>
            No images uploaded
          </div>
        )}

      </div>

    </div>
  );
}