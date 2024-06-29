"use client";

import { getCourseInfo } from "@/actions/getCourseInfo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Clock10, Star, StarIcon, UserRound, VideoIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StarRating } from "@/app/_components/StarRating";

export default function CoursePage({ params }: { params: any }) {
  const [courseData, setCourseData] = useState<any>({});
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const session = useSession();

  const addCoursetoWishList = async () => {
    try {
      const res = await axios.post("/api/wishlist", {
        courseId: params.courseId,
      });

      setIsInWishlist(true);
      toast({
        title: "Success",
        description: "Course is successfully added to wishlist",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "error",
        description: error.message,
      });
    }
  };
  const removeFromWishlist = async () => {
    try {
      const res = await axios.delete("/api/wishlist", {
        params: {
          courseId: params.courseId,
        },
      });

      setIsInWishlist(false);

      toast({
        title: "Success",
        description: "Course is successfully removed from wishlist",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "error",
        description: error.message,
      });
    }
  };
  const purchaseCoures = async () => {
    try {
      await axios.post("/api/purchase-course", {
        courseId: params.courseId,
      });
      setIsPurchased(true);
      toast({
        title: "Course purchased successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: error.message,
      });
      console.log(error.message);
    }
  };

  useEffect(() => {
    const getInfo = async () => {
      if (params && params.courseId) {
        try {
          const data = await getCourseInfo({ courseId: params.courseId });
          setCourseData(data);
        } catch (error) {
          toast({
            variant: "destructive",
            description: "Error fetching course information.",
          });
        }
      } else {
        console.error("Course ID is undefined");
      }
    };

    const getWslinfo = async () => {
      try {
        const res = await axios.get("/api/wishlist", {
          params: {
            courseId: params.courseId,
          },
        });
        setIsInWishlist(res.data.isInWishlist);
      } catch (error: any) {
        console.log(error);
      }
    };

    const getPurchaseInfo = async () => {
      try {
        const res = await axios.get("/api/purchase-course", {
          params: {
            courseId: params.courseId,
          },
        });
        setIsPurchased(res.data.isCoursePurchased);
      } catch (error) {
        console.log(error);
      }
    };

    getWslinfo();
    getInfo();
    getPurchaseInfo();
  }, [params, isInWishlist, isPurchased, isRatingSubmitted]);

  const handleRating = (value: any) => {
    !isRatingSubmitted && setRating(value);
  };

  const submitRating = async () => {
    try {
      await axios.post("/api/rate-course", {
        newRating: rating,
      }, {
        params : {
          courseId : params.courseId
        }
      });
      setIsRatingSubmitted(true);
      toast({
        title : "Success",
        description : "Rating is Successfully Submitted"
      })
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="bg-primary">
      <div className="w-full py-10">
        <div className="flex justify-center items-center p-10">
          <div className="border-2 border-black bg-white dark:bg-black rounded-lg shadow-lg max-w-5xl py-10 px-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
              <div className="flex flex-col space-y-6 text-center lg:text-left">
                <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white my-3">
                  {courseData.title}
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {courseData.description}
                </p>
                <div className="flex justify-center lg:justify-start">
                  <div className="px-4 py-2 bg-yellow-300 rounded-md font-serif">
                    <p className="text-center text-sm font-medium text-gray-900">
                      Bestseller
                    </p>
                  </div>
                </div>
                <div className="flex justify-center lg:justify-start">

                <StarRating rating={courseData.rating} />
                </div>
                <div className="my-2 text-sm text-gray-600 dark:text-gray-400">
                  Created by
                  <span className="text-violet-600 underline ml-1">
                    {courseData.instructor}
                  </span>
                </div>
                <div className="flex gap-2 justify-center lg:justify-start items-center text-gray-600 dark:text-gray-400">
                  <UserRound /> {courseData.studentsEnrolledCount}+ students
                  enrolled
                </div>
                <div className="flex gap-2 justify-center lg:justify-start items-center text-gray-600 dark:text-gray-400">
                  <VideoIcon /> {courseData.duration} hours on-demand video
                </div>
                <div className="flex gap-2 justify-center lg:justify-start items-center text-gray-600 dark:text-gray-400">
                  <Clock10 /> Created At {courseData.createdAt?.split("T")[0]}
                </div>
              </div>
              <div className="flex justify-center items-center">
                <img
                  className="border-2 border-white rounded-lg w-[350px] h-[230px] object-cover"
                  src={courseData.thumbnail}
                  alt={courseData.title}
                />
              </div>
            </div>
            <div className="flex justify-center items-center mt-10">
              {session.data?.user ? (
                <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-6">
                  {isInWishlist ? (
                    <Button
                      variant={"destructive"}
                      onClick={removeFromWishlist}
                      className="w-full lg:w-auto dark:bg-red-600 dark:hover:bg-red-500"
                    >
                      Remove from Wishlist
                    </Button>
                  ) : (
                    <Button
                      onClick={addCoursetoWishList}
                      className="w-full lg:w-auto"
                    >
                      Add to Wishlist
                    </Button>
                  )}
                  {isPurchased ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="bg-green-600 hover:bg-green-500 w-full lg:w-auto"
                        >
                          View Content
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Rate this Course</DialogTitle>
                          <DialogDescription>
                            Please rate the course out of 5 stars.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-8 w-8 cursor-pointer ${
                                  rating >= star
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                onClick={() => handleRating(star)}
                              >
                                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.42 8.302L12 18.897l-7.421 4.675L6 15.27 0 9.423l8.332-1.268z" />
                              </svg>
                            ))}
                          </div>
                          <Button onClick={submitRating} disabled={isRatingSubmitted} className="mt-4">
                            {isRatingSubmitted ? "Rating Submitted"  : "Submit Rating"}
                          </Button>
                        </div>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button
                      onClick={purchaseCoures}
                      className="w-full lg:w-auto"
                    >
                      Buy Course
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-center w-full">
                  <Link href="/signin">
                    <Button className="w-full lg:w-auto">
                      Login to Continue
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
