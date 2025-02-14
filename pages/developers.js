import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

function MeetTheDevelopersPage() {
  return (
    <section className="text-gray-600 body-font">
      <Head>
        <title>Meet the minds behind!</title>
        <meta
          name="description"
          content="Meet the minds behind this open-source project!"
        />

        {/* Meta tags og */}
        <meta property="og:title" content="Meet the developers!" />
        <meta
          property="og:description"
          content="The minds behind Adaalat- A court management system to register court hearings."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dapafwlvo/image/upload/v1635871194/developers_u12bmd.png"
        />
        <meta
          property="og:url"
          content="https://adaalat.vercel.app/developers"
        />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Twitter */}
        <meta name="twitter:title" content="Meet the developers!" />
        <meta
          name="twitter:description"
          content="The minds behind Adaalat- A court management system to register court hearings."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dapafwlvo/image/upload/v1635871194/developers_u12bmd.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="container px-5 py-24 mx-auto">
        <div className="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
          <div className="sm:w-44 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-pink-100 text-pink-500 flex-shrink-0">
            {/* Image */}
            <Image
              src="/anuj.jpg"
              className="rounded-full"
              layout="intrinsic"
              width="200"
              height="200"
              alt="Anuj"
            />
          </div>
          <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0 flex-col">
            <h2 className="text-gray-900 text-2xl title-font font-medium mb-2">
              Anuj Chaudhary
            </h2>
            <p className="leading-relaxed text-base">
              "Passionate Full Stack Developer with expertise in building and
              testing APIs, developing dynamic front-end components, and
              crafting seamless user experiences.
            </p>
            <div className=" flex flex-row gap-2 mt-1">
              <Link href="https://github.com/Anuj054">
                <a target="_blank">
                  <img src="/github.png" className="  h-[30px] w-[30px]" />
                </a>
              </Link>{" "}
              <Link href="https://www.linkedin.com/in/anuj-chaudhary-5b5629255/">
                <a target="_blank">
                  <img src="/linkedin.png" className=" h-[30px] w-[30px]" />
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
          <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
            <h2 className="text-gray-900 text-2xl title-font font-medium mb-2">
              Amrit Singhal
            </h2>
            <p className="leading-relaxed text-base">
              "Versatile Full Stack Developer focused on building scalable APIs
              and intuitive front-end interfaces using JavaScript."
            </p>
            <div className=" flex flex-row gap-2 mt-1">
              <Link href="https://github.com/amrit1004">
                <a target="_blank">
                  <img src="/github.png" className="  h-[30px] w-[30px]" />
                </a>
              </Link>{" "}
              <Link href="https://www.linkedin.com/in/amrit-singhal-63b75a256/">
                <a target="_blank">
                  <img src="/linkedin.png" className=" h-[30px] w-[30px]" />
                </a>
              </Link>
            </div>
          </div>
          <div className="sm:w-44 sm:order-none order-first sm:h-32 h-20 w-20 sm:ml-10 inline-flex items-center justify-center rounded-full bg-pink-100 text-pink-500 flex-shrink-0">
            <Image
              src="/amrit.jpg"
              className="rounded-full"
              layout="intrinsic"
              width="200"
              height="200"
              alt="Amrit"
            />
          </div>
        </div>
        <div className="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
          <div className="sm:w-44 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-pink-100 text-pink-500 flex-shrink-0">
            {/* Image */}
            <Image
              src="/ankush.jpg"
              className="rounded-full "
              layout="intrinsic"
              width="200"
              height="200"
              alt="Image"
            />
          </div>
          <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
            <h2 className="text-gray-900 text-2xl title-font font-medium mb-2">
              Ankush Rawat
            </h2>
            <p className="leading-relaxed text-base">
              Dedicated Full Stack Developer delivering efficient, user-centric
              web applications with expertise in JavaScript and API
              integration."
            </p>
            <div className=" flex flex-row gap-2 mt-1">
              <Link href="https://github.com/Anuj054">
                <a target="_blank">
                  <img src="/github.png" className="  h-[30px] w-[30px]" />
                </a>
              </Link>{" "}
              <Link href="https://www.linkedin.com/in/ankush-rawat-b29957256/">
                <a target="_blank">
                  <img src="/linkedin.png" className=" h-[30px] w-[30px]" />
                </a>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
          <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
            <h2 className="text-gray-900 text-2xl title-font font-medium mb-2">
              Aditya Raina
            </h2>
            <p className="leading-relaxed text-base">
              An aspiring software developer. Currently pursuing bachelor degree
              in Computer engineering.
            </p>
            <div className=" flex flex-row gap-2 mt-1">
              <Link href="https://github.com/Anuj054">
                <a target="_blank">
                  <img src="/github.png" className="  h-[30px] w-[30px]" />
                </a>
              </Link>{" "}
              <Link href="https://www.linkedin.com/in/anuj-chaudhary-5b5629255/">
                <a target="_blank">
                  <img src="/linkedin.png" className=" h-[30px] w-[30px]" />
                </a>
              </Link>
            </div>
          </div>
          <div className="sm:w-44 sm:order-none order-first sm:h-32 h-20 w-20 sm:ml-10 inline-flex items-center justify-center rounded-full bg-pink-100 text-pink-500 flex-shrink-0">
            <Image
              src="/raina.jpeg"
              className="rounded-full"
              layout="intrinsic"
              width="200"
              height="200"
              alt="Aditya"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MeetTheDevelopersPage;
