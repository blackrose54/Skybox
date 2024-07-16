"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { z } from "zod";
// import { FontAwesomeIcon } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useMutation } from "convex/react";
import { Loader2, Upload } from "lucide-react";
import { FC, ReactElement, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { filetype } from "../../convex/schema";
import { useRouter } from "next/navigation";

interface UploadButtonProps {}

const formSchema = z.object({
  title: z.string().min(1).max(50),
  file: z
    .custom<FileList>((value) => value instanceof FileList, "Required")
    .refine((value) => value.length > 0, "Required"),
});

const UploadButton: FC<UploadButtonProps> = ({}): ReactElement => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const orgId = useOrganization().organization?.id;

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const sendFile = useAction(api.files.sendFile);

  const fileref = form.register("file");


  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values: z.infer<typeof formSchema>
  ) => {
    try {
      console.log({ file: values.file });
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();
      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": values.file[0].type! },
        body: values.file[0],
      });
      const res = await result.json();
      console.log(res);
      const { storageId } = res;
      // Step 3: Save the newly allocated storage id to the database
      let type: filetype = "unknown";

      switch (values.file[0].type) {
        case "image/jpeg":
        case "image/png":
        case "image/gif":
          type = "image";
          break;
        case "application/pdf":
          type = "pdf";
          break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
        case "text/plain":
          type = "document";
          break;
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        case "application/vnd.ms-powerpoint":
        case "application/vnd.oasis.opendocument.presentation":
          type = "ppt";
          break;
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/vnd.ms-excel":
          type = "csv";
          break;

        case "audio/MPA":
        case "audio/mpeg":
        case "audio/mp4":
        case "audio/ogg":
          type = "audio";
          break;

        case "application/json":
  break;

        case "video/AV1":
        case "video/MPV":
        case "video/mpeg4-generic":
        case "video/ogg":
        case "video/mp4":
          type = "video";
          break;
        
        case "text/markdown":
          type = "markdown";
          break;

        default:
          type = "unknown";
      }

      // Step 4: Send the file details to the server for storage and processing
      await sendFile({
        storageId,
        name: values.title,
        orgId: orgId || "",
        type,
      });
      form.reset();
      setIsDialogOpen(false);
      toast.success("File Upload Successfully");
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <></>;

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={(o) => setIsDialogOpen(o)}>
        <DialogTrigger>
      
          <Button className=" flex gap-x-2">
            <Upload size={18} />
            <p className="max-sm:visible max-md:hidden">Upload File</p>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className=" space-y-2 ">
            <h1 className=" text-2xl font-semibold">Upload Your File Here</h1>
            <p className=" text-muted-foreground text-sm">
              Files will be accessible to others the organization
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input type="file" {...fileref} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-24" type="submit">
                {form.formState.isSubmitting ? (
                  <Loader2 className=" animate-spin" />
                ) : (
                  <p className=" select-none">Submit</p>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadButton;
