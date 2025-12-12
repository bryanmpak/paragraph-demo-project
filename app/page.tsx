import Image from "next/image";
import { PerfSettingsProvider } from "../components/perf-settings";
import PerfDemoPanel from "../components/perf-demo-panel";
import CommentsSection from "../components/comments-section";
import { POST_ID } from "@/lib/constants";

export default function Home() {
  // note: used claude code to fetch hard-coded post for illustrative purposes
  return (
    <PerfSettingsProvider initialLimit={100}>
      <div className="base-layout flex flex-col flex-1 bg-background">
        <header className="top-0 left-0 right-0 z-30 flex h-16 items-center gap-4 px-4 sm:px-6 justify-between sticky sm:pl-6 backdrop-blur bg-background/90 global-header">
          <div className="absolute left-4 sm:left-6 md:left-1/2 md:-translate-x-1/2 flex items-center h-full">
            <a className="flex items-center gap-2 group" href="/">
              <span className="relative flex shrink-0 overflow-hidden my-auto h-7 w-7 rounded-sm transition-opacity group-hover:opacity-80">
                <Image
                  alt="AVC"
                  loading="lazy"
                  width={92}
                  height={92}
                  className="aspect-square h-full w-full overflow-hidden rounded-sm"
                  src="/avc-avatar.jpg"
                />
              </span>
              <h1 className="text-base font-semibold transition-opacity group-hover:opacity-80">
                AVC
              </h1>
            </a>
          </div>
        </header>

        <div className="sticky top-16 z-20 px-4 sm:px-6 bg-background/90 backdrop-blur border-b border-border">
          <div className="max-w-4xl mx-auto py-3">
            <PerfDemoPanel postId={POST_ID} />
          </div>
        </div>

        <div className="flex flex-col mb-8">
          <div className="w-full">
            <div className="flex flex-col justify-between space-y-10 wrap-break-words">
              <main id="main-post-body">
                <div className="flex max-w-400 mx-auto justify-between flex-col">
                  <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:px-8 w-full xl:shrink-0"></div>
                </div>
              </main>
              <div className="mx-auto">
                <div className="sm:px-4 max-w-4xl mx-auto sm:mt-8 mb-0">
                  <Image
                    alt="Cover photo"
                    width={2372}
                    height={1186}
                    className="object-cover object-center max-h-[422px] sm:rounded-2xl mx-auto"
                    src="/cover.jpg"
                  />
                </div>
              </div>

              <div className="max-w-full min-w-full mx-auto lg:px-8">
                <header className="relative z-20">
                  <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:px-8">
                    <h1
                      id="post-title"
                      className="mt-2 font-header text-foreground text-3xl sm:text-4xl"
                      dir="auto"
                    >
                      Gen What?
                    </h1>
                    <div className="flex flex-col my-6 sm:my-10 post-action-bar">
                      <div className="flex justify-between items-center w-full gap-3 flex-wrap">
                        <div className="flex w-full">
                          <div className="-space-x-2 flex justify-center mr-2 *:z-10 items-center">
                            <div className="z-10 cursor-pointer relative">
                              <span className="relative flex shrink-0 overflow-hidden transition-all my-auto rounded-full h-10 w-10 dark:border-none ring ring-background">
                                <Image
                                  alt="AVC"
                                  loading="lazy"
                                  width={40}
                                  height={40}
                                  className="aspect-square h-full w-full overflow-hidden rounded-full"
                                  src="/avc-avatar.jpg"
                                />
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-foreground">
                              <span>AVC</span>
                            </p>
                            <div className="flex flex-row align-middle justify-start items-center">
                              <span className="hidden text-sm md:flex align-middle text-muted-foreground mb-0">
                                1 min read
                              </span>
                              <span className="hidden md:flex mx-2">·</span>
                              <time
                                dateTime="2025-12-09T12:06:54.238Z"
                                className="text-sm flex align-middle text-muted-foreground"
                              >
                                December 9, 2025
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                <main id="main-post-body">
                  <div className="flex max-w-400 mx-auto justify-between flex-col">
                    <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:px-8 w-full xl:shrink-0">
                      <div className="h-full w-full pb-8">
                        <div className="prose">
                          <p>
                            The Gotham Gal and I were born in 1961, at the tail
                            end of the baby boom. Or so we thought.
                          </p>
                          <p>
                            In{" "}
                            <a
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              href="https://www.nytimes.com/2025/12/02/t-magazine/gen-x-generation.html"
                            >
                              an excellent longish essay on GenX
                            </a>{" "}
                            in T Magazine, Amanda Fortini writes:
                          </p>
                          <blockquote>
                            <p>
                              The consensus, particularly among elder Gen X-ers
                              .. is that the endpoints were mysteriously
                              revised, but no one seems to know why or when or
                              by whom .....many hold that the real Gen X range
                              is 1961 to 1981 — beginning when fertility rates
                              declined, soon after the Food and Drug
                              Administration&apos;s 1960 approval of the birth
                              control pill..... Still, a 2017{" "}
                              <a
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                href="https://www.jchs.harvard.edu/blog/defining-the-generations-redux"
                              >
                                Harvard University Joint Center for Housing
                                Studies article
                              </a>{" "}
                              placed Gen X at 1965 to 1984, recasting four years
                              of millennials as Gen X-ers, in part because
                              &quot;using 20-year age spans for each
                              generation&quot; makes it &quot;easier to compare
                              them.&quot; It also renders much generational
                              theorizing meaningless.
                            </p>
                          </blockquote>
                          <p>
                            While I largely agree that this generational
                            theorizing can be pretty meaningless, it is fun. And
                            so is{" "}
                            <a
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              href="https://www.nytimes.com/2025/12/02/t-magazine/gen-x-generation.html"
                            >
                              Amanda&apos;s essay
                            </a>
                            , particularly if you are GenX. My friend Pat called
                            the essay, &quot;my so called life&quot;. That
                            cracked me up. If you were born between 1961 and
                            1984, you should read it. It will be at least a fun
                            trip down memory lane, and maybe more, for you.
                          </p>
                          <p>
                            I likely am a baby boomer. If growing up in a Leave
                            It To Beaver household is the measure, that was me
                            and my family. And it was warm, safe, healthy, and
                            happy. I believe I am a boomer because of that.
                          </p>
                          <p>
                            The Gotham Gal, on the other hand, grew up in the
                            classic 70s household where the kids would come home
                            to an empty house and had the run of the place. And
                            everything else too. I believe she&apos;s GenX
                            because of that.
                          </p>
                          <p>
                            Does any of this matter? I don&apos;t think it
                            matters much. But there are cultural differences
                            between children and their parents and charting them
                            and understanding them can be helpful to marketers
                            and anthropologists. And for the rest of us, it sure
                            can be a lot of fun.
                          </p>
                        </div>
                      </div>

                      <div className="post-footer">
                        <div className="bg-[#1b1817] rounded-2xl p-6 flex flex-col md:flex-row w-full gap-4 md:items-center">
                          <div className="flex gap-4 flex-1 min-w-0">
                            <Image
                              alt="AVC"
                              loading="lazy"
                              width={112}
                              height={112}
                              className="mx-auto rounded-md shrink-0 w-14 h-14 object-cover"
                              src="/avc-avatar.jpg"
                            />
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                              <p className="text-xl font-semibold line-clamp-1">
                                Subscribe to AVC
                              </p>
                              <p className="text-muted text-sm">
                                &gt;37K subscribers
                              </p>
                            </div>
                          </div>
                          <div>
                            <button
                              className="btn-secondary inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium h-10 px-4 py-2 font-sans mx-auto w-full md:w-auto"
                              type="button"
                              disabled
                            >
                              Subscribed
                            </button>
                          </div>
                        </div>

                        <CommentsSection postId={POST_ID} />
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>

        <footer className="font-sans mt-18 w-80 mx-auto flex flex-col justify-center">
          <button
            className="btn-secondary font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium h-10 px-4 py-2 w-full"
            type="button"
            disabled
          >
            Start writing
          </button>
          <div className="mx-auto flex flex-row gap-3 my-4 text-muted">
            <a
              href="https://farcaster.xyz/paragraph"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="520"
                height="457"
                viewBox="-20 -20 560 497"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-muted-foreground hover:text-foreground transition-all"
              >
                <path
                  d="M519.801 0V61.6809H458.172V123.31H477.054V123.331H519.801V456.795H416.57L416.507 456.49L363.832 207.03C358.81 183.251 345.667 161.736 326.827 146.434C307.988 131.133 284.255 122.71 260.006 122.71H259.8C235.551 122.71 211.818 131.133 192.979 146.434C174.139 161.736 160.996 183.259 155.974 207.03L103.239 456.795H0V123.323H42.7471V123.31H61.6262V61.6809H0V0H519.801Z"
                  stroke="currentColor"
                  strokeWidth="40"
                ></path>
              </svg>
            </a>
            <a
              href="https://x.com/paragraph_xyz"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="24"
                height="23"
                viewBox="0 0 24 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-all hover:text-foreground"
              >
                <path
                  d="M0.256759 0L9.36588 12.1823L0.200012 22.0873H2.26348L10.289 13.4158L16.7728 22.0873H23.7935L14.1723 9.21978L22.7043 0H20.6409L13.2506 7.98633L7.27889 0H0.258127H0.256759ZM3.29035 1.52002H6.51495L20.7571 20.5673H17.5325L3.29035 1.52002Z"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
            <a
              href="https://paragraph.com/@blog"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                className="h-5 w-5 transition-all hover:text-foreground"
                width="30"
                height="30"
                viewBox="0 0 81 82"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 0V76.1345H81"
                  stroke="currentColor"
                  strokeWidth="10.6585"
                  strokeMiterlimit="10"
                ></path>
                <path
                  d="M34.4067 5.30176L6 76.1337L76.0722 46.9673"
                  stroke="currentColor"
                  strokeWidth="10.6585"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M6 76.129L59.0302 21.5845"
                  stroke="currentColor"
                  strokeWidth="10.6585"
                  strokeMiterlimit="10"
                ></path>
              </svg>
            </a>
          </div>
          <nav
            aria-label="Discover Paragraph content"
            className="text-xs text-center text-muted-foreground mb-2 flex flex-row flex-wrap gap-4 justify-center"
          >
            <a className="text-blue-500" href="/explore">
              Popular posts
            </a>
            <a className="text-blue-500" href="/explore/publications">
              Trending publications
            </a>
          </nav>
          <p className="text-sm text-center text-muted-foreground mb-2">
            ©️ 2025 Paragraph Technologies Inc
          </p>
          <p className="text-xs text-center text-muted-foreground mb-4 flex flex-row gap-4 justify-center">
            <a
              className="text-blue-500"
              href="https://paragraph.com/privacy"
              target="_blank"
              rel="noreferrer"
            >
              Privacy policy
            </a>
            <a
              className="text-blue-500"
              href="https://paragraph.com/terms-of-use"
              target="_blank"
              rel="noreferrer"
            >
              Terms of use
            </a>
            <a
              className="text-blue-500"
              href="https://paragraph.com/home"
              target="_blank"
              rel="noreferrer"
            >
              Discover great writing
            </a>
          </p>
        </footer>
      </div>
    </PerfSettingsProvider>
  );
}
