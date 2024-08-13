"use client";

import React, { useState, useEffect } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ChatInterface from "../../components/ChatInterface";

const ChatPage: React.FC = () => {
	const [showDisclaimer, setShowDisclaimer] = useState(true);

	useEffect(() => {
	  const hasAccepted = localStorage.getItem('disclaimerAccepted');
	  if (hasAccepted) {
	    setShowDisclaimer(false);
	  }
	}, []);

	const handleAccept = () => {
		localStorage.setItem('disclaimerAccepted', 'true');
		setShowDisclaimer(false);
	};

	return (
		<div className="min-h-screen relative">
			<ChatInterface />
			<AlertDialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
				<AlertDialogContent className="z-50">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-3xl text-center">
							⚠️ Disclaimer ⚠️
						</AlertDialogTitle>
						<AlertDialogDescription className="text-lg text-center">
							This sexual health chatbot is designed to provide general
							information and education only. It is not a substitute for
							professional medical advice, diagnosis, or treatment.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={handleAccept}>Accept</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default ChatPage;
