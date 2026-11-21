"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Loader2, Smile, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { supabaseClient } from "@/supabase";

const MAX_CAPTION = 100;
const BUCKET = "POST_IMAGES";

const Page = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const inputRef = useRef(null);
  const router = useRouter();
  const supabase = supabaseClient();

  // Free the preview URL when the image changes or the page unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const selectFile = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      toast.add({ type: "error", description: "Please choose an image file" });
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleFileChange = (e) => selectFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    selectFile(e.dataTransfer.files?.[0]);
  };

  const resetImage = () => {
    setFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handlePost = async () => {
    if (!file || isPosting) return;
    setIsPosting(true);

    try {
      // step 1: upload to the bucket (unique name so files never collide)
      const ext = file.name.split(".").pop();
      const path = `images/${Date.now()}-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file);
      if (uploadError) throw uploadError;

      // step 2: get the public URL
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

      // step 3: save the post
      const { error: insertError } = await supabase.from("posts").insert({
        imageUrl: data.publicUrl,
        caption: caption.trim(),
      });
      if (insertError) throw insertError;

      toast.add({ type: "success", description: "Your post has been shared" });
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.add({ type: "error", description: "Error, try again" });
      setIsPosting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-4 dark:bg-neutral-950">
      <div className="w-full max-w-4xl overflow-hidden rounded-xl border bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
        <header className="relative flex h-11 items-center justify-between border-b px-3 dark:border-neutral-800">
          {file ? (
            <button
              onClick={resetImage}
              disabled={isPosting}
              aria-label="Back"
              className="rounded-full p-1 hover:bg-neutral-100 disabled:opacity-50 dark:hover:bg-neutral-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => router.back()}
              aria-label="Close"
              className="rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold">
            Create new post
          </h1>

          {file ? (
            <button
              onClick={handlePost}
              disabled={isPosting}
              className="flex items-center gap-1 text-sm font-semibold text-sky-500 hover:text-sky-700 disabled:opacity-50"
            >
              {isPosting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPosting ? "Sharing" : "Share"}
            </button>
          ) : (
            <span className="w-7" />
          )}
        </header>

        {/* Body */}
        {!file ? (
          // Step 1: choose an image
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex aspect-square max-h-[70vh] w-full flex-col items-center justify-center gap-4 transition-colors md:aspect-[4/3] ${
              isDragging ? "bg-sky-50 dark:bg-sky-950/30" : ""
            }`}
          >
            <ImagePlus
              strokeWidth={1}
              className={`h-24 w-24 ${isDragging ? "text-sky-500" : ""}`}
            />
            <p className="text-xl">Drag photos here</p>
            <Button
              onClick={() => inputRef.current?.click()}
              className="bg-sky-500 font-semibold text-white hover:bg-sky-600"
            >
              Select from computer
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </div>
        ) : (
          // Step 2: preview + caption
          <div className="flex flex-col md:flex-row">
            <div className="flex aspect-square w-full items-center justify-center bg-black md:w-3/5">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="flex w-full flex-col md:w-2/5 md:border-l dark:border-neutral-800">
              <div className="flex items-center gap-3 p-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                  <div className="h-full w-full rounded-full bg-neutral-200 dark:bg-neutral-700" />
                </div>
                <span className="text-sm font-semibold">you</span>
              </div>

              <Textarea
                placeholder="Write a caption..."
                maxLength={MAX_CAPTION}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={isPosting}
                className="min-h-40 flex-1 resize-none border-0 px-4 shadow-none focus-visible:ring-0"
              />

              <div className="flex items-center justify-between border-b px-4 py-2 text-neutral-400 dark:border-neutral-800">
                <Smile className="h-5 w-5" />
                <span className="text-xs">
                  {caption.length}/{MAX_CAPTION}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
