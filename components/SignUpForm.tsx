"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { useState } from "react";

const formSchema = z.object({
  username: z
    .string()
    .max(50, "Username must be 50 characters or less")
    .nonempty("Username is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(50),
  role: z.string().nonempty("Role is required"),
});

export function SignUpForm() {
  const [isSubmit, setIsSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      setIsSubmit(true);
      setErrorMessage("");
    } catch (e) {
      setErrorMessage(
        "Failed to create account. Please try again. Error :" + e
      );
    }
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Role</FormLabel>
              <Select {...field} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-[180px] text-white">
                    <SelectValue
                      placeholder="Who are you?"
                      className="text-white"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#1A1A1A]">
                  <SelectItem value="client" className="text-white">
                    Client
                  </SelectItem>
                  <SelectItem value="consultant" className="text-white">
                    Consultant
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {isSubmit ? (
          <p className="text-white">Account created!</p>
        ) : (
          <Button
            type="submit"
            className="cursor-pointer bg-white text-black hover:bg-gray-200/90 flex items-center justify-center"
            size="lg"
          >
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
