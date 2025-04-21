import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/AboutUSCard.jsx";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

const AboutUs = ({
  user,
  heading = "📚 StudyMate",
  description = "Your smart and simple study partner, helping you learn better with quick notes, tips, and quizzes!",
  posts = [
    {
      id: "post-1",
      title: "🚀 Why StudyMate Exists",
      summary:
        "Studying often feels overwhelming — with notes everywhere, inconsistent schedules, and lost learning content. StudyMate was created to bring clarity to your chaos. It combines everything you need in one smart workspace, powered by AI. From organizing your materials to simplifying your study flow, it helps you stay focused, reduce stress, and truly enjoy the process of learning.",
      url: "https://shadcnblocks.com",
      image: "/images/block/placeholder-dark-1.svg",
      tags: ["Student Productivity", "Smart Learning", "Simplified Study"],
    },
    {
      id: "post-2",
      title: "📦 Personalized Study Boxes",
      summary:
        "Forget about jumping between folders and scattered files. With StudyMate’s Study Boxes, you can create subject-wise spaces to store your notes, goals, links, tasks, and more — all in one clean, visual layout. It’s like your digital bookshelf, customized just for your learning style.",
      url: "https://shadcnblocks.com",
      image: "/images/block/placeholder-dark-1.svg",
      tags: ["Subject Wise", "Resource Organizer", "Smart Shelf"],
    },
    {
      id: "post-3",
      title: "📝 Smart Note Organizer",
      summary:
        "Tired of messy and unstructured notes? StudyMate lets you write, edit, and neatly organize your notes with smart features. Add tags, highlight important lines, and let AI turn long text into short, easy-to-revise points. Ideal for those who want notes that are both sharp and searchable.",
      url: "https://shadcnblocks.com",
      image: "/images/block/placeholder-dark-1.svg",
      tags: ["AI Note Helper", "Quick Revision", "Smart Note Organizer"],
    },
    {
      id: "post-4",
      title: "🧠 AI-Powered Learning Insights",
      summary:
        "Why take notes manually when AI can do it for you? With StudyMate, whenever you watch a video or explore a topic, our AI understands the content and instantly generates key takeaways, summaries, and topic-based notes — saving hours of effort while improving retention and clarity.",
      url: "https://shadcnblocks.com",
      image: "/images/block/placeholder-dark-1.svg",
      tags: ["AI Summary", "Video Context", "Auto Notes"],
    },
  ],
}) => {
  const navigate = useNavigate();

  if (user) {
    navigate("/dashboard");
    return;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4">
      <div
        className="absolute top-4 left-4 text-white flex items-center gap-2 cursor-pointer
      hover:scale-125 transition-all duration-300"
      >
        <Link to={"/"} className="text-xl bg-zinc-950 p-2 rounded-full">
          <IoMdArrowRoundBack />
        </Link>
      </div>

      <section className="py-32">
        <div className="container flex flex-col items-center gap-16">
          <div className="text-center">
            <h2
              className="mx-auto mb-6 text-pretty text-3xl font-bold md:text-4xl lg:max-w-3xl
          text-white"
            >
              {heading}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
              {description}
            </p>
          </div>

          <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
              >
                <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                  <div className="sm:col-span-5">
                    <div className="mb-4 md:mb-6">
                      <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider text-muted-foreground md:gap-5 lg:gap-6">
                        {post.tags?.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline
                    text-white"
                      >
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-4 text-muted-foreground md:mt-5">
                      {post.summary}
                    </p>
                    {/* <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                    <span className="text-muted-foreground">{post.author}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{post.published}</span>
                  </div> */}
                    {/* <div className="mt-6 flex items-center space-x-2 md:mt-8">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center font-semibold hover:underline md:text-base"
                    >
                      <span>Read more</span>
                      <ArrowRight className="ml-2 size-4 transition-transform" />
                    </a>
                  </div> */}
                  </div>

                  <div className="order-first sm:order-last sm:col-span-5">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <div className="aspect-[16/9] overflow-clip rounded-lg border border-border">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-opacity duration-200 fade-in hover:opacity-70"
                        />
                      </div>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export { AboutUs };
