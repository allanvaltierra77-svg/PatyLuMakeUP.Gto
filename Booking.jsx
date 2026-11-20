import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Clock, CheckCircle2, MessageCircle, Home, ChevronLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const ADMIN_WHATSAPP = "524731242303";
const timeSlots = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00"
];

function buildWhatsAppURL({ clientName, service, date, time }) {
  const message = `💄 Nueva cita PatyLu Make Up 💄\n\nCliente: ${clientName}\nServicio: ${service}\nFecha: ${date}\nHora: ${time}\n\nPendiente de confirmar anticipo.`;
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export default function Booking() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingResult, setBookingResult] = useState(null); // { clientName, service, date, time }
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: () => base44.entities.Service.list(),
  });

  const createBooking = useMutation({
    mutationFn: (data) => base44.entities.Booking.create(data),
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      const user = await base44.auth.me().catch(() => null);
      const formattedDate = format(selectedDate, "d 'de' MMMM yyyy", { locale: es });
      setBookingResult({
        clientName: user?.full_name || user?.email || "Cliente",
        service: variables.service_name,
        date: formattedDate,
        time: variables.time,
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Campos requeridos",
        description: "Por favor selecciona servicio, fecha y hora",
        variant: "destructive",
      });
      return;
    }
    const service = services.find((s) => s.name === selectedService);
    createBooking.mutate({
      service_name: selectedService,
      service_category: service?.category || "",
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      notes,
      status: "pending",
    });
  };

  const handleNewBooking = () => {
    setBookingResult(null);
    setSelectedService("");
    setSelectedDate(null);
    setSelectedTime("");
    setNotes("");
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (bookingResult) {
    const waURL = buildWhatsAppURL(bookingResult);
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-gold" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-heading text-2xl font-semibold text-foreground mb-2 text-center"
        >
          ¡Cita enviada!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="font-body text-sm text-muted-foreground text-center mb-1"
        >
          Tu cita fue enviada correctamente, pronto será confirmada.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="font-body text-xs text-muted-foreground text-center mb-8"
        >
          {bookingResult.service} · {bookingResult.date} · {bookingResult.time}
        </motion.p>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="w-full space-y-3"
        >
          <a
            href={waURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-body text-sm font-medium text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle className="w-5 h-5" />
            Notificar por WhatsApp
          </a>

          <Button
            variant="outline"
            onClick={handleNewBooking}
            className="w-full font-body text-sm"
          >
            Reservar otra cita
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-full font-body text-sm text-muted-foreground gap-2"
          >
            <Home className="w-4 h-4" />
            Regresar al inicio
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── Booking form ────────────────────────────────────────────────────────────
  return (
    <div className="px-5 pt-6">
      <Link to="/" className="inline-flex items-center gap-1 font-body text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Inicio
      </Link>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-heading text-2xl font-semibold text-foreground mb-1">
          Reservar Cita
        </h1>
        <p className="font-body text-sm text-muted-foreground">
          Selecciona tu servicio y horario preferido
        </p>
      </motion.div>

      <div className="space-y-5">
        {/* Service */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label className="font-body text-xs font-medium text-foreground mb-2 block">Servicio</label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Selecciona un servicio" />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s.id} value={s.name} className="font-body">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Date */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="font-body text-xs font-medium text-foreground mb-2 block">Fecha</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start font-body text-sm">
                <CalendarDays className="w-4 h-4 mr-2 text-gold" />
                {selectedDate
                  ? format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })
                  : "Selecciona una fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </motion.div>

        {/* Time */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <label className="font-body text-xs font-medium text-foreground mb-2 block">Hora</label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Selecciona una hora" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time} className="font-body">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gold" />
                    {time}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Notes */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <label className="font-body text-xs font-medium text-foreground mb-2 block">
            Notas adicionales (opcional)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Cuéntanos más sobre lo que buscas..."
            className="font-body text-sm resize-none"
            rows={3}
          />
        </motion.div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={createBooking.isPending}
            className="w-full bg-gold hover:bg-gold/90 text-white font-body font-medium py-6 text-sm"
          >
            {createBooking.isPending ? "Reservando..." : "Confirmar cita"}
          </Button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">o</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <a
            href={`https://wa.me/${ADMIN_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-body text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle className="w-5 h-5" />
            Contactar directamente por WhatsApp
          </a>
        </motion.div>
      </div>
    </div>
  );
}