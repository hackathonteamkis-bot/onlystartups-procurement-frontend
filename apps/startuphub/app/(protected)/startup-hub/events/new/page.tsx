"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createEvent, updateEvent, getEventById } from "@/actions/startup-hub/events";
import { getSignedUploadUrl } from "@/actions/user/storage";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { Button, Input, Label, Textarea } from "@onlystartups/ui";
import { Loader2, ArrowRight, ArrowLeft, Rocket, Image as ImageIcon, Plus, Trash2, Calendar, MapPin, Users, Ticket, Clock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";

function EventWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editId);

  // Step 1: Details & Branding
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState("IN_PERSON");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tags, setTags] = useState<string[]>([""]);
  const [image, setImage] = useState("");

  // Step 2: Speakers
  const [speakers, setSpeakers] = useState<{name: string, role: string, company: string, socialUrl: string}[]>([]);

  // Step 3: Agenda
  const [agenda, setAgenda] = useState<{time: string, title: string, description: string}[]>([]);

  // Step 4: Ticketing
  const [isPaidEvent, setIsPaidEvent] = useState(false);
  const [ticketTypes, setTicketTypes] = useState<{name: string, price: string, capacity: string}[]>([{ name: "General Admission", price: "0", capacity: "" }]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!editId) return;
    const fetchEvent = async () => {
      try {
        const res = await getEventById(editId);
        if (res && !res.error) {
          setTitle(res.title || "");
          setDescription(res.description || "");
          setFormat(res.format || "IN_PERSON");
          setLocation(res.location || "");
          if (res.date) setDate(new Date(res.date).toISOString().split('T')[0]);
          setTime(res.time || "");
          setTags(res.tags?.length ? res.tags : [""]);
          setImage(res.image || "");
          setSpeakers(res.speakers?.length ? res.speakers : []);
          setAgenda(res.agenda?.length ? res.agenda : []);
          
          if (res.ticketTypes?.length) {
            setTicketTypes(res.ticketTypes);
            setIsPaidEvent(res.ticketTypes.some((t: any) => parseFloat(t.price) > 0));
          }
        }
      } catch (err) {
        toast.error("Failed to load event details");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchEvent();
  }, [editId]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handlePublish = async () => {
    if (!title || !date || !location) {
      return toast.error("Title, Date, and Location are required.");
    }
    
    setSaving(true);
    try {
      const totalCapacity = ticketTypes.reduce((sum, ticket) => sum + (parseInt(ticket.capacity, 10) || 0), 0);
      
      const payload = {
        title,
        description,
        format,
        location,
        date: new Date(date).toISOString(),
        time,
        maxAttendees: totalCapacity > 0 ? totalCapacity : null,
        image,
        tags: tags.filter(t => t.trim() !== ""),
        speakers: speakers.filter(s => s.name.trim() !== ""),
        agenda: agenda.filter(a => a.title.trim() !== ""),
        ticketTypes: ticketTypes.filter(t => t.name.trim() !== "").map(t => ({
          ...t,
          price: isPaidEvent ? t.price : "0"
        })),
        status: "PUBLISHED"
      };
      
      if (editId) {
        const res = await updateEvent(editId, payload);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Event updated successfully!");
          router.push(`/startup-hub/events/${editId}`);
        }
      } else {
        const res = await createEvent(payload);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Event created successfully!");
          router.push("/startup-hub/events");
        }
      }
    } catch (err) {
      toast.error(editId ? "Failed to update event" : "Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImage(objectUrl);

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be less than 2MB");
    }

    const toastId = toast.loading("Uploading image...");
    try {
      const authRes = await fetch("/api/auth/session");
      const session = await authRes.json();
      if (!session?.user?.id) throw new Error("Unauthorized");

      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${session.user.id}/events/${fileName}`;

      const signedRes = await getSignedUploadUrl(filePath);
      if (signedRes.error || !signedRes.signedUrl || !signedRes.token) {
        throw new Error(signedRes.error || "Failed to get signed URL");
      }

      
      let fileToUpload = file;
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true };
        fileToUpload = await imageCompression(file, options);
      } catch (e) { console.warn("Compression failed", e); }

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .uploadToSignedUrl(filePath, signedRes.token, fileToUpload);


      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(filePath);

      setImage(publicUrl);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image", { id: toastId });
    }
  };

  // Helper arrays
  const addTag = () => setTags([...tags, ""]);
  const updateTag = (idx: number, val: string) => {
    const newTags = [...tags];
    newTags[idx] = val;
    setTags(newTags);
  };
  const removeTag = (idx: number) => setTags(tags.filter((_, i) => i !== idx));

  const addSpeaker = () => setSpeakers([...speakers, { name: "", role: "", company: "", socialUrl: "" }]);
  const removeSpeaker = (idx: number) => setSpeakers(speakers.filter((_, i) => i !== idx));
  const updateSpeaker = (idx: number, field: string, val: string) => {
    const newSpeakers = [...speakers];
    newSpeakers[idx] = { ...newSpeakers[idx], [field]: val };
    setSpeakers(newSpeakers);
  };

  const addAgenda = () => setAgenda([...agenda, { time: "", title: "", description: "" }]);
  const removeAgenda = (idx: number) => setAgenda(agenda.filter((_, i) => i !== idx));
  const updateAgenda = (idx: number, field: string, val: string) => {
    const newAgenda = [...agenda];
    newAgenda[idx] = { ...newAgenda[idx], [field]: val };
    setAgenda(newAgenda);
  };

  const addTicket = () => setTicketTypes([...ticketTypes, { name: "", price: "", capacity: "" }]);
  const removeTicket = (idx: number) => setTicketTypes(ticketTypes.filter((_, i) => i !== idx));
  const updateTicket = (idx: number, field: string, val: string) => {
    const newTickets = [...ticketTypes];
    newTickets[idx] = { ...newTickets[idx], [field]: val };
    setTicketTypes(newTickets);
  };

  if (initialLoading) {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-20 p-4 sm:p-6">
      <Link href="/startup-hub/events" className="text-xs font-black text-muted-foreground flex items-center gap-2 hover:text-[#1A1A2E] transition-colors tracking-widest uppercase w-fit">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Events
      </Link>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{editId ? "Edit Event" : "Create Event"}</h1>
          <p className="text-gray-500 text-sm mt-1">{editId ? "Update your event details." : "Set up a new event for your hub."}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 hidden sm:flex">
          <span className={step >= 1 ? "text-[#1A1A2E] font-bold" : ""}>Basics</span>
          <ArrowRight className="w-4 h-4" />
          <span className={step >= 2 ? "text-[#1A1A2E] font-bold" : ""}>Speakers</span>
          <ArrowRight className="w-4 h-4" />
          <span className={step >= 3 ? "text-[#1A1A2E] font-bold" : ""}>Agenda</span>
          <ArrowRight className="w-4 h-4" />
          <span className={step >= 4 ? "text-[#1A1A2E] font-bold" : ""}>Ticketing</span>
        </div>
      </div>

      <div className="w-full">
        {step === 1 && (
          <form onSubmit={handleNext} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Step 1: Event Identity</h2>
              <p className="text-gray-500 text-sm">Set the foundational details of your event.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Event Title <span className="text-red-500">*</span></Label>
                <Input required placeholder="e.g. AI Founder Showcase 2024" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={4} placeholder="What will attendees learn or experience?" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Format</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={format} onChange={(e) => setFormat(e.target.value)}
                  >
                    <option value="IN_PERSON">In-Person</option>
                    <option value="VIRTUAL">Virtual / Online</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Location / Link <span className="text-red-500">*</span></Label>
                  <Input required placeholder={format === 'VIRTUAL' ? "Zoom/Meet Link" : "HQ Address"} value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Date <span className="text-red-500">*</span></Label>
                  <Input required type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event Tags / Categories</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input placeholder="e.g. AI, Networking" value={tag} onChange={(e) => updateTag(i, e.target.value)} className="w-32" />
                      <button type="button" onClick={() => removeTag(i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addTag}>+ Add Tag</Button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <Label>Event Cover Image (16:9 Ratio)</Label>
                <div className="flex items-start gap-6">
                  {image ? (
                    <div className="w-64 rounded-xl overflow-hidden border border-gray-200 relative group shrink-0 shadow-sm bg-gray-100" style={{ aspectRatio: '16/9' }}>
                      <Image src={image} alt="Event Cover" fill unoptimized className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <label className="cursor-pointer text-white text-sm font-semibold">
                          Change Image
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="w-64 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all shrink-0" style={{ aspectRatio: '16/9' }}>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500 font-medium">Upload Cover (16:9)</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button type="submit" className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white">
                Save & Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Step 2: Speakers & Panelists</h2>
              <p className="text-gray-500 text-sm">Add the experts who will be sharing their insights.</p>
            </div>

            <div className="space-y-4">
              {speakers.map((speaker, i) => (
                <div key={i} className="relative p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pr-8">
                    <div className="space-y-2">
                      <Label className="text-xs">Name</Label>
                      <Input placeholder="Jane Doe" value={speaker.name} onChange={(e) => updateSpeaker(i, 'name', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Role / Title</Label>
                      <Input placeholder="CEO" value={speaker.role} onChange={(e) => updateSpeaker(i, 'role', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Company</Label>
                      <Input placeholder="Acme Corp" value={speaker.company} onChange={(e) => updateSpeaker(i, 'company', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">LinkedIn URL</Label>
                      <Input placeholder="https://linkedin.com/in/..." value={speaker.socialUrl} onChange={(e) => updateSpeaker(i, 'socialUrl', e.target.value)} />
                    </div>
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Button variant="ghost" size="icon" onClick={() => removeSpeaker(i)} className="text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addSpeaker} className="w-full border-dashed">
                <Plus className="w-4 h-4 mr-2" /> Add a Speaker
              </Button>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious}>Back</Button>
              <Button onClick={() => setStep(3)} className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white">
                Save Speakers <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Step 3: Agenda Builder</h2>
              <p className="text-gray-500 text-sm">Outline the schedule so attendees know what to expect.</p>
            </div>

            <div className="space-y-4">
              {agenda.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50 relative">
                  <div className="w-full sm:w-32 space-y-2">
                    <Label className="text-xs">Time</Label>
                    <Input type="time" value={item.time} onChange={(e) => updateAgenda(i, 'time', e.target.value)} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Session Title</Label>
                      <Input placeholder="Keynote Speech" value={item.title} onChange={(e) => updateAgenda(i, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Description (Optional)</Label>
                      <Textarea rows={2} placeholder="Brief summary of what will be covered..." value={item.description} onChange={(e) => updateAgenda(i, 'description', e.target.value)} />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button variant="ghost" size="icon" onClick={() => removeAgenda(i)} className="text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addAgenda} className="w-full border-dashed">
                <Clock className="w-4 h-4 mr-2" /> Add Agenda Block
              </Button>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious}>Back</Button>
              <Button onClick={() => setStep(4)} className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white">
                Save Agenda <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Step 4: Ticketing & Launch</h2>
              <p className="text-gray-500 text-sm">Configure how people can register for this event.</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Event Pricing</h3>
                <div className="flex gap-4 mb-6">
                  <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 ${!isPaidEvent ? 'border-[#1A1A2E] bg-gray-50 ring-1 ring-[#1A1A2E]' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="pricing" className="hidden" checked={!isPaidEvent} onChange={() => setIsPaidEvent(false)} />
                    <span className="font-semibold">Free Event</span>
                  </label>
                  <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 ${isPaidEvent ? 'border-[#1A1A2E] bg-gray-50 ring-1 ring-[#1A1A2E]' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="pricing" className="hidden" checked={isPaidEvent} onChange={() => setIsPaidEvent(true)} />
                    <span className="font-semibold">Paid Event</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Ticket Types</h3>
                {ticketTypes.map((ticket, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Label className="text-xs">Ticket Name</Label>
                      <Input placeholder="General Admission" value={ticket.name} onChange={(e) => updateTicket(i, 'name', e.target.value)} />
                    </div>
                    {isPaidEvent && (
                      <div className="w-full sm:w-32">
                        <Label className="text-xs">Price (₹)</Label>
                        <Input placeholder="Price" type="number" value={ticket.price} onChange={(e) => updateTicket(i, 'price', e.target.value)} />
                      </div>
                    )}
                    <div className="w-full sm:w-32">
                      <Label className="text-xs">Capacity limit</Label>
                      <Input placeholder="Unlimited" type="number" value={ticket.capacity} onChange={(e) => updateTicket(i, 'capacity', e.target.value)} />
                    </div>
                    <div className="pt-6">
                      <Button variant="ghost" size="icon" onClick={() => removeTicket(i)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addTicket} className="border-dashed mt-2">
                  <Ticket className="w-4 h-4 mr-2" /> Add Ticket Tier
                </Button>
              </div>
            </div>

            <div className="flex justify-between pt-12">
              <Button variant="outline" onClick={handlePrevious}>Back</Button>
              <Button onClick={handlePublish} disabled={saving} size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8">
                {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : (editId ? "Save Changes" : "Publish Event")} <Rocket className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function NewEventPage() {
  return (
    <Suspense fallback={<div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>}>
      <EventWizardContent />
    </Suspense>
  );
}
