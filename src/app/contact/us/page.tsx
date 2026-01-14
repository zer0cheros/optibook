'use client';
import dynamic from "next/dynamic";


const RouteMap = dynamic(() => import("@/components/contact/app-contact-map"), {
  ssr: false,
});
 

export default function page() {
  return (
    <RouteMap/>
  )
}
