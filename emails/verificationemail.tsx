import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
    Container,
    Body,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
    username: string;
    otp: string | number;
}

export default function VerificationEmail({
    username,
    otp,
}: VerificationEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Here&apos;s your verification code: {String(otp)}</Preview>
            <Tailwind>
                <Body className="bg-gray-100 my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white">
                        <Section className="mt-[32px]">
                            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                                Verify your email address
                            </Heading>
                        </Section>

                        <Section>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Hello {username},
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                You registered an account on My App. To complete your registration, please use the following One-Time Password (OTP):
                            </Text>

                            <Section className="text-center mt-[32px] mb-[32px]">
                                <Text className="text-black font-bold text-[36px] tracking-widest my-0">
                                    {otp}
                                </Text>
                            </Section>

                            <Text className="text-black text-[14px] leading-[24px]">
                                If you didn&apos;t request this, please ignore this email.
                            </Text>
                        </Section>

                        <Section>
                            <Row>
                                <Text className="text-center text-gray-500 text-[12px] mt-[20px]">
                                    &copy; {new Date().getFullYear()} My App. All rights reserved.
                                </Text>
                            </Row>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
