"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  search: z.string().min(1,{message:"Required"}).max(50),
});

function Search() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  const onSubmit:SubmitHandler<z.infer<typeof formSchema>> = async(data) =>{
    console.log(data);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8 w-full">
      <FormField
        control={form.control}
        name="search"
        render={({ field }) => (
          <FormItem className=" w-[50%] mx-auto ">
            <FormControl>
              <div className=" flex gap-x-4 items-center">
                <Input placeholder="Search your files" {...field} />
                <Button type="submit">Search</Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      </form>
    </Form>
  );
}

export default Search;
