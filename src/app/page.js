'use client'

import { supabaseClient } from "@/supabase";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNowStrict } from 'date-fns'

export default function Home() {
  const [posts, setPosts] = useState([])
  const supabase = supabaseClient()

  const getPosts = async () => {
    const response = await supabase
      .from("posts")
      .select("*, profile(username, profileImage)");
    setPosts(response.data)
  }

  console.log(posts)
  useEffect(() => {
    getPosts()
  }, [])

  return (
    <div>
      {
        posts.map((post) => {
          return (
            <div key={post.id}>
              <div className="flex flex-row">
                <Avatar>
                  <AvatarImage src={post.profile.profileImage} />
                  <AvatarFallback>{post.profile.username.slice(0, 2)}</AvatarFallback>
                </Avatar>

                <div>{post.profile.username}</div>

                <div>{formatDistanceToNowStrict(post.created_at, { addSuffix: true })} </div>
              </div>
              <img src={post.imageUrl} width={300} height={400} />
              <div>{post.caption}</div>
            </div>
          )
        })
      }
    </div>
  );
}
