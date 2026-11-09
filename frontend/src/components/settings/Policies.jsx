
import React, { useState } from "react";

const policies = [
    {
        id: "terms",
        title: "Terms of Service",
        description: "Rules and conditions for using Caché.",
        icon: "bi-file-earmark-text",
        content: [
            {
                heading: "Acceptance of Terms",
                text: "By accessing or using Caché, you agree to follow these Terms of Service. If you do not agree with these terms, you should not use the platform.",
            },
            {
                heading: "User Accounts",
                text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities performed through your account.",
            },
            {
                heading: "User Responsibilities",
                text: "Users must provide accurate information, respect other users and avoid activities that violate applicable laws or these terms.",
            },
            {
                heading: "Account Restrictions",
                text: "Caché may restrict or suspend accounts that violate platform rules, subject to applicable policies and laws.",
            },
        ],
    },
    {
        id: "privacy",
        title: "Privacy Policy",
        description: "Learn how your personal information is handled.",
        icon: "bi-shield-lock",
        content: [
            {
                heading: "Information We Collect",
                text: "Caché may collect account information, profile details and content you submit to the platform. The exact information collected will depend on the features you use.",
            },
            {
                heading: "How Information Is Used",
                text: "Information may be used to operate the platform, provide requested features, maintain security and improve user experience.",
            },
            {
                heading: "Information Sharing",
                text: "Personal information should only be shared with third parties as described in the final published Privacy Policy and applicable law.",
            },
            {
                heading: "Your Privacy Choices",
                text: "You may be able to review or update certain account information and privacy preferences through Settings.",
            },
        ],
    },
    {
        id: "cookies",
        title: "Cookie Policy",
        description: "Understand how cookies and similar technologies work.",
        icon: "bi-cookie",
        content: [
            {
                heading: "What Are Cookies?",
                text: "Cookies are small data files stored by your browser that can help websites remember preferences and maintain sessions.",
            },
            {
                heading: "How Cookies Are Used",
                text: "Caché may use essential cookies for authentication, security and core platform functionality.",
            },
            {
                heading: "Cookie Preferences",
                text: "You can manage cookies through your browser settings. Disabling certain cookies may affect some platform features.",
            },
        ],
    },
    {
        id: "community",
        title: "Community Guidelines",
        description: "Standards expected from everyone in our community.",
        icon: "bi-people",
        content: [
            {
                heading: "Respect Everyone",
                text: "Treat other members respectfully. Harassment, threats, targeted abuse and hateful behaviour are not acceptable.",
            },
            {
                heading: "Authenticity",
                text: "Do not impersonate others, misrepresent your identity or engage in deceptive behaviour.",
            },
            {
                heading: "Safe Community",
                text: "Do not share content that promotes violence, exploitation or illegal activities.",
            },
            {
                heading: "Enforcement",
                text: "Reported content may be reviewed and appropriate action may be taken under the platform's moderation rules.",
            },
        ],
    },
    {
        id: "content",
        title: "Content Policy",
        description: "Understand what content is allowed on Caché.",
        icon: "bi-card-text",
        content: [
            {
                heading: "Permitted Content",
                text: "Users may share lawful content that respects the rights, safety and privacy of others.",
            },
            {
                heading: "Prohibited Content",
                text: "Content involving threats, harassment, exploitation, illegal activities or other prohibited material is not allowed.",
            },
            {
                heading: "Content Ownership",
                text: "Users retain ownership of content they create, subject to the permissions necessary to operate the platform.",
            },
        ],
    },
    {
        id: "copyright",
        title: "Copyright Policy",
        description: "Information about intellectual property and copyright.",
        icon: "bi-c-circle",
        content: [
            {
                heading: "Respect Intellectual Property",
                text: "Users must respect copyrights, trademarks and other intellectual property rights.",
            },
            {
                heading: "Reporting Copyright Issues",
                text: "If you believe content infringes your copyright, use the platform's reporting process to submit the relevant details.",
            },
            {
                heading: "Content Removal",
                text: "Content may be reviewed and restricted or removed when a valid infringement is identified, subject to applicable law.",
            },
        ],
    },
    {
        id: "safety",
        title: "Report & Safety Policy",
        description: "Reporting, moderation and account safety.",
        icon: "bi-shield-check",
        content: [
            {
                heading: "Report Content",
                text: "Users should report posts, comments or accounts that appear to violate platform policies.",
            },
            {
                heading: "Review Process",
                text: "Reports may be reviewed by the moderation team. Appropriate action depends on the nature and severity of the issue.",
            },
            {
                heading: "Account Safety",
                text: "Keep your login credentials private and report suspicious account activity.",
            },
        ],
    },
    {
        id: "about",
        title: "About Caché",
        description: "Learn more about Caché and the platform.",
        icon: "bi-info-circle",
        content: [
            {
                heading: "About the Platform",
                text: "Caché is a social platform designed to help people connect, share content and interact with their communities.",
            },
            {
                heading: "Our Goal",
                text: "We aim to provide a simple, engaging and respectful environment for sharing ideas and experiences.",
            },
            {
                heading: "Platform Information",
                text: "Product details, ownership information and contact details should be added here before the platform is publicly launched.",
            },
        ],
    },
];

function Policies() {
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    return (
        <>
            <div>
                <div className="mb-4">
                    <h5
                        className="fw-semibold mb-1"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Policies & Legal
                    </h5>

                    <p
                        className="small mb-0"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        Find information about our terms, policies and community standards.
                    </p>
                </div>

                {policies.map((policy) => (
                    <button
                        key={policy.id}
                        type="button"
                        className="btn w-100 border-0 text-start d-flex align-items-center gap-3 py-3 px-2"
                        onClick={() => setSelectedPolicy(policy)}
                        style={{
                            borderBottom: "1px solid var(--color-border)",
                            borderRadius: 0,
                            color: "var(--color-text-primary)",
                        }}
                    >
                        <div
                            className="d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "var(--color-primary-light)",
                                color: "var(--color-primary)",
                            }}
                        >
                            <i className={`bi ${policy.icon} fs-5`} />
                        </div>

                        <div className="flex-grow-1">
                            <div className="fw-semibold small mb-1">
                                {policy.title}
                            </div>

                            <small style={{ color: "var(--color-text-muted)" }}>
                                {policy.description}
                            </small>
                        </div>

                        <i
                            className="bi bi-chevron-right"
                            style={{ color: "var(--color-text-muted)" }}
                        />
                    </button>
                ))}
            </div>

            {/* Policy Dialog */}
            {selectedPolicy && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-sm-3"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.55)",
                        zIndex: 2200,
                    }}
                    onClick={() => setSelectedPolicy(null)}
                >
                    <div
                        className="w-100 d-flex flex-column"
                        style={{
                            maxWidth: "650px",
                            maxHeight: "85vh",
                            backgroundColor: "var(--color-surface)",
                            borderRadius: "var(--radius-xl)",
                            boxShadow: "var(--shadow-lg)",
                            overflow: "hidden",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Dialog Header */}
                        <div
                            className="d-flex align-items-center justify-content-between p-3 p-md-4 border-bottom"
                            style={{ borderColor: "var(--color-border)" }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "var(--radius-md)",
                                        backgroundColor: "var(--color-primary-light)",
                                        color: "var(--color-primary)",
                                    }}
                                >
                                    <i className={`bi ${selectedPolicy.icon} fs-5`} />
                                </div>

                                <div>
                                    <h5
                                        className="fw-semibold mb-0"
                                        style={{ color: "var(--color-text-primary)" }}
                                    >
                                        {selectedPolicy.title}
                                    </h5>
                                    <small style={{ color: "var(--color-text-muted)" }}>
                                        Caché Policies
                                    </small>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn border-0 p-1"
                                onClick={() => setSelectedPolicy(null)}
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                <i className="bi bi-x-lg fs-5" />
                            </button>
                        </div>

                        {/* Dialog Content */}
                        <div className="p-3 p-md-4 overflow-auto">
                            <div
                                className="small mb-4"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                Please review the following information about{" "}
                                {selectedPolicy.title.toLowerCase()}.
                            </div>

                            {selectedPolicy.content.map((item, index) => (
                                <section key={index} className="mb-4">
                                    <h6
                                        className="fw-semibold mb-2"
                                        style={{ color: "var(--color-text-primary)" }}
                                    >
                                        {item.heading}
                                    </h6>

                                    <p
                                        className="mb-0"
                                        style={{
                                            color: "var(--color-text-secondary)",
                                            lineHeight: "1.8",
                                            fontSize: "14px",
                                        }}
                                    >
                                        {item.text}
                                    </p>
                                </section>
                            ))}
                        </div>

                        {/* Dialog Footer */}
                        <div
                            className="p-3 border-top d-flex justify-content-end"
                            style={{ borderColor: "var(--color-border)" }}
                        >
                            <button
                                type="button"
                                className="btn px-4"
                                onClick={() => setSelectedPolicy(null)}
                                style={{
                                    backgroundColor: "var(--color-primary)",
                                    color: "var(--color-white)",
                                    borderRadius: "var(--radius-md)",
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Policies;
