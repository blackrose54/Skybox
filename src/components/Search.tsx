"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import qs from 'qs'

const formSchema = z.object({
  search: z.string().max(50),
});

function Search({ query ,route}: { query: string,route:string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: query,
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    const params = {
      search: data.search,
    };

    router.replace(
      `${route}?` +
        qs.stringify(params)
    );
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-8 md:w-[50%]"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className=" mx-auto w-full  ">
              <FormControl>
                <div className=" flex gap-x-4 items-center">
                  <Input placeholder="Search your files" {...field} />
                  <Button className=" space-x-2" type="submit">
                    <SearchIcon size={20} />
                    <p>Search</p>
                  </Button>
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
