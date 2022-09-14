import type { NextPage, GetStaticProps } from "next";
import { decode } from "html-entities";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

type NextPageAugmented<P = {}, IP = P> = NextPage<P, IP>;

type Blog = {
  title: string;
  json: string;
  slug: string;
  thumbnail: string;
};

const Home: NextPageAugmented<{ blogs: Blog[] }> = ({ blogs }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.identity}>
          <div className={styles.logo}>
            <img src="/xo-logo.png" width="100px" alt="afterglow logo" />
          </div>
          <h1>xoaftergloww</h1>
          <div className={styles.twitter}>Twitter</div>
        </div>
        <section className={styles.blogs}>
          {blogs.map((blog: Blog) => (
            <a
              href={`https://xoafterglow.com/read/${blog.slug}`}
              key={blog.slug}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.Blog}>
                <div className={styles.Blog__info}>
                  <h2>{decode(blog.title)}</h2>
                </div>
                <div className={styles.Blog__overlay}></div>
                <Image src={blog.thumbnail} layout="fill" objectFit="cover" />
              </div>
            </a>
          ))}
        </section>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

function getThumbnail(jsonString: string) {
  try {
    return JSON.parse(jsonString)._embedded["wp:featuredmedia"]
      ? JSON.parse(jsonString)._embedded["wp:featuredmedia"][0].media_details
          .sizes["et-pb-portfolio-image"]?.source_url
      : "https://xoafterglow.com/read/default-thumbnail.webp";
  } catch (e) {
    return "https://xoafterglow.com/read/default-thumbnail.webp";
  }
}

export const getStaticProps: GetStaticProps = async context => {
  const res = await fetch("https://xoafterglow.com/api/blogs/all-preview", {
    headers: {
      "XO-API-KEY": process.env.XO_API_KEY ? process.env.XO_API_KEY : "",
    },
  });

  const data = await res.json();
  const blogs = data.map((blog: Blog) => ({
    ...blog,
    thumbnail: getThumbnail(blog.json),
  }));

  return {
    props: { blogs },
    revalidate: 60 * 60,
  };
};

export default Home;
