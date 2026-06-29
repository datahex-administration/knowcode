import { ContactForm } from "@/components/ContactForm";

export const metadata = { title: "Contact — KnowCode Academy" };

export default function ContactPage() {
  return (
    <div className="container-x py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-extrabold text-navy">Get in touch</h1>
          <p className="mt-3 text-navy/65">
            Questions about a course, schedules or enrollment? Send us a message
            and our team will reach out.
          </p>

          <div className="mt-8 space-y-4">
            <div className="card p-5">
              <p className="text-sm font-semibold text-navy">Email</p>
              <p className="text-navy/60">hello@knowcode.academy</p>
            </div>
            <div className="card p-5">
              <p className="text-sm font-semibold text-navy">WhatsApp</p>
              <p className="text-navy/60">Chat-based support, fast replies.</p>
            </div>
            <div className="card p-5">
              <p className="text-sm font-semibold text-navy">Hours</p>
              <p className="text-navy/60">Mon–Sat, 10:00–18:00</p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
