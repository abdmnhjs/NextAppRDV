"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    username: z.string().max(50),
    password: z.string().max(50),
    passwordAgain: z.string().max(50),
  })
  .refine((data) => data.password === data.passwordAgain, {
    message: "Passwords don't match",
    path: ["passwordAgain"],
  });

export function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordAgain: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-md"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Username</FormLabel>
              <FormControl>
                <Input className="text-white" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <Input className="text-white" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordAgain"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Confirm Password</FormLabel>
              <FormControl>
                <Input className="text-white" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4 items-center justify-center">
          <Select>
            <SelectTrigger className="w-[180px] text-white">
              <SelectValue placeholder="Who are you ?" className="text-white" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A]">
              <SelectItem value="client" className="text-white">
                Client
              </SelectItem>
              <SelectItem value="consultant" className="text-white">
                Consultant
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="submit"
            className="cursor-pointer bg-white text-black hover:bg-gray-200/90 flex items-center justify-center"
            size="lg"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
