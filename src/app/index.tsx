import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AssistantAvatar } from '../components/AssistantAvatar';
import { ConfettiEffect } from '../components/ConfettiEffect';
import { DatePickerField } from '../components/DatePickerField';
import { LoadingScreen } from '../components/LoadingScreen';
import { PlayStyleSelector } from '../components/PlayStyleSelector';
import { ProgressBar } from '../components/ProgressBar';
import { ReferralSourceSelector } from '../components/ReferralSourceSelector';
import { SoundToggle } from '../components/SoundToggle';
import { Theme } from '../constants/theme';
import {
  AssistantMood,
  MemberLogPayload,
  SurveyAnswers,
  SurveyStep,
} from '../types/survey';
import {
  playBack,
  playCelebration,
  playNext,
  playPop,
} from '../utils/sound';

const STEP_SEQUENCE: SurveyStep[] = [
  'intro',
  'q1_name',
  'q2_birthdate',
  'q3_phone',
  'q4_ign',
  'q5_uid',
  'q6_playstyle',
  'q7_source',
  'q8_detail',
  'outro',
];

export default function SurveyScreen() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({
    name: '',
    birthDate: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    phone: '',
    ign: '',
    uid: '',
    playStyle: null,
    referralSource: null,
    refereeName: '',
    mediaDetails: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading screen preview / asset load timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // Animation values for step transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentStep = STEP_SEQUENCE[currentStepIndex];

  // Helper to trigger card transition
  const transitionToStep = (newIndex: number) => {
    setErrorMessage('');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -15,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStepIndex(newIndex);
      slideAnim.setValue(15);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 'q1_name') {
      if (!answers.name.trim()) {
        setErrorMessage('Please let us know your name so we know what to call you! ✨');
        playPop();
        return;
      }
    } else if (currentStep === 'q2_birthdate') {
      if (!answers.birthYear || !answers.birthMonth || !answers.birthDay) {
        setErrorMessage('Please select your birth year, month, and day! 🎂');
        playPop();
        return;
      }
    } else if (currentStep === 'q3_phone') {
      const cleanPhone = answers.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 7) {
        setErrorMessage('Boss said contact is required! Please enter a valid phone number. 📞');
        playPop();
        return;
      }
    } else if (currentStep === 'q4_ign') {
      if (!answers.ign.trim()) {
        setErrorMessage('Please enter your In Game Name (IGN)! 🎮');
        playPop();
        return;
      }
    } else if (currentStep === 'q5_uid') {
      const cleanUid = answers.uid.replace(/[^0-9]/g, '');
      if (cleanUid.length < 3) {
        setErrorMessage('Please enter your numeric Game UID so we can verify your IGN! 🔍');
        playPop();
        return;
      }
    } else if (currentStep === 'q6_playstyle') {
      if (!answers.playStyle) {
        setErrorMessage('Please select whether you prefer Casual or Competitive! ⚔️');
        playPop();
        return;
      }
    } else if (currentStep === 'q7_source') {
      if (!answers.referralSource) {
        setErrorMessage('Please let us know how you heard about Exalted! 🤝');
        playPop();
        return;
      }
    } else if (currentStep === 'q8_detail') {
      if (answers.referralSource === 'referred' && !answers.refereeName.trim()) {
        setErrorMessage('Please tell us the name of the clan member who referred you! 🌟');
        playPop();
        return;
      }
      if (answers.referralSource === 'media' && !answers.mediaDetails.trim()) {
        setErrorMessage('Please share where you saw our media or who reposted it! 📱');
        playPop();
        return;
      }
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEP_SEQUENCE.length) {
      if (STEP_SEQUENCE[nextIndex] === 'outro') {
        playCelebration();
      } else {
        playNext();
      }
      transitionToStep(nextIndex);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      playBack();
      transitionToStep(currentStepIndex - 1);
    }
  };

  // Keyboard navigation on Web (Enter to advance, Escape to go back)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger enter advance if user is in multiline input or if on outro
      if (e.key === 'Enter' && currentStep !== 'outro') {
        handleNext();
      } else if (e.key === 'Escape' && currentStepIndex > 0) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, answers, currentStep]);

  // Determine current Assistant Mood
  const getAssistantMood = (): AssistantMood => {
    switch (currentStep) {
      case 'intro':
        return 'waving';
      case 'q1_name':
        return answers.name ? 'happy' : 'curious';
      case 'q2_birthdate':
        return 'curious';
      case 'q3_phone':
        return 'note';
      case 'q4_ign':
        return 'gaming';
      case 'q5_uid':
        return 'inspecting';
      case 'q6_playstyle':
        return 'thoughtful';
      case 'q7_source':
        return 'curious';
      case 'q8_detail':
        return answers.referralSource === 'referred' ? 'impressed' : 'happy';
      case 'outro':
        return 'celebrating';
      default:
        return 'waving';
    }
  };

  // Format responses summary for copying
  const generateSummaryText = () => {
    const playStyleStr = answers.playStyle === 'casual' ? 'Casual (Relax & Chill)' : 'Competitive (Frontline Honor)';
    const sourceStr =
      answers.referralSource === 'referred'
        ? `Referred by clan member: ${answers.refereeName}`
        : `Media posts: ${answers.mediaDetails}`;

    return [
      `⚔️ EXALTED CLAN • RECRUITMENT APPLICATION ⚔️`,
      `------------------------------------------`,
      `👤 Preferred Name: ${answers.name}`,
      `🎂 Birthday: ${answers.birthMonth}/${answers.birthDay}/${answers.birthYear}`,
      `📞 Contact Number: ${answers.phone}`,
      `🎮 In Game Name (IGN): ${answers.ign}`,
      `🆔 Game UID: ${answers.uid}`,
      `⚔️ Playstyle: ${playStyleStr}`,
      `📢 How they found us: ${sourceStr}`,
      `------------------------------------------`,
      `Submitted via Exalted Clan Interview Assistant`,
    ].join('\n');
  };

  const handleCopySummary = () => {
    playPop();
    const summary = generateSummaryText();
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const now = new Date();
      const dateJoined = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const dateOfBirth = `${answers.birthYear}-${String(answers.birthMonth).padStart(2, '0')}-${String(answers.birthDay).padStart(2, '0')}`;
      const playstyle = answers.playStyle === 'casual' ? 'Casual' : 'Competitive';
      const survey1 =
        answers.referralSource === 'referred'
          ? 'Referred by an active player inside the Exalted clan'
          : 'Media posts';
      const survey2 =
        answers.referralSource === 'referred'
          ? answers.refereeName.trim()
          : answers.mediaDetails.trim();

      const payload: MemberLogPayload = {
        dateJoined,
        name: answers.name.trim(),
        dateOfBirth,
        phoneNumber: answers.phone.trim(),
        ign: answers.ign.trim(),
        uid: answers.uid.trim(),
        playstyle,
        survey1,
        survey2,
      };

      await fetch(
        "https://script.google.com/macros/s/AKfycbyrD7DMflNs6pvcwbkyMSRNGfMDMu7fHK1Quscvtvh7tvsZnDOK-RuIBUAiMrQ_CDnj/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        }
      );

      playCelebration();
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('Failed to send application to member log. Please check your connection and try again.');
      playPop();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render question content
  const renderQuestionBody = () => {
    const applicantName = answers.name.trim() || 'friend';
    const ignDisplay = answers.ign.trim() || 'Warrior';

    switch (currentStep) {
      case 'intro':
        return (
          <View style={styles.contentSection}>
            <View style={styles.dialogueBox}>
              <Text style={styles.dialogueText}>
                Hi! I'm the <Text style={styles.dialogueHighlight}>Exalted Clan's</Text> Interview Assistant! I'm new here as well, hope we get along!
              </Text>
            </View>

            <View style={styles.introPillsContainer}>
              <View style={styles.introPill}>
                <Ionicons name="sparkles" size={16} color={Theme.colors.accentGold} />
                <Text style={styles.introPillText}>One Question at a Time</Text>
              </View>
              <View style={styles.introPill}>
                <Ionicons name="arrow-back" size={16} color={Theme.colors.primary} />
                <Text style={styles.introPillText}>Backtrack Anytime</Text>
              </View>
              <View style={styles.introPill}>
                <Ionicons name="shield-checkmark" size={16} color={Theme.colors.accentSage} />
                <Text style={styles.introPillText}>Official Admissions</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleNext}
              style={styles.primaryActionButton}
            >
              <Text style={styles.primaryActionText}>Nice to meet you! Let's Begin</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        );

      case 'q1_name':
        return (
          <View style={styles.contentSection}>
            <View style={styles.dialogueBox}>
              <Text style={styles.dialogueText}>
                What's would you like us to call you?
              </Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Your Preferred Name / Nickname</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={Theme.colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Alex, Val, Kai..."
                  placeholderTextColor={Theme.colors.textPlaceholder}
                  value={answers.name}
                  onChangeText={(val) => {
                    setAnswers((prev) => ({ ...prev, name: val }));
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoFocus
                  returnKeyType="next"
                  onSubmitEditing={handleNext}
                />
                {answers.name.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setAnswers((prev) => ({ ...prev, name: '' }))}
                    style={styles.clearBtn}
                  >
                    <Ionicons name="close-circle" size={18} color={Theme.colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              {answers.name.trim().length > 0 && (
                <View style={styles.badgeHint}>
                  <Text style={styles.badgeHintText}>
                    👋 Hello, <Text style={{ fontWeight: '700' }}>{answers.name.trim()}</Text>! That sounds great!
                  </Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'q2_birthdate':
        return (
          <View style={styles.contentSection}>
            <View style={styles.dialogueBox}>
              <Text style={styles.dialogueText}>
                That's a wonderful name, <Text style={styles.dialogueHighlight}>{applicantName}</Text>! When were you born? We are curious to know!
              </Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Date of Birth</Text>
              <DatePickerField
                day={answers.birthDay}
                month={answers.birthMonth}
                year={answers.birthYear}
                onChangeDay={(day) => {
                  setAnswers((prev) => ({ ...prev, birthDay: day }));
                  if (errorMessage) setErrorMessage('');
                }}
                onChangeMonth={(month) => {
                  setAnswers((prev) => ({ ...prev, birthMonth: month }));
                  if (errorMessage) setErrorMessage('');
                }}
                onChangeYear={(year) => {
                  setAnswers((prev) => ({ ...prev, birthYear: year }));
                  if (errorMessage) setErrorMessage('');
                }}
              />
            </View>
          </View>
        );

      case 'q3_phone':
        return (
          <View style={styles.contentSection}>
            <View style={styles.dialogueBox}>
              <Text style={styles.dialogueText}>
                Ah— Boss said contact is required so we can call you when you are offline and needed. May we ask your phone number?
              </Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Contact Phone Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color={Theme.colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="+63 912 345 6789 or your mobile digits"
                  placeholderTextColor={Theme.colors.textPlaceholder}
                  value={answers.phone}
                  keyboardType="phone-pad"
                  onChangeText={(val) => {
                    setAnswers((prev) => ({ ...prev, phone: val }));
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoFocus
                  returnKeyType="next"
                  onSubmitEditing={handleNext}
                />
              </View>
              <Text style={styles.helperText}>
                🔒 Only shared with clan admins for emergency pings & offline squad coordination.
              </Text>
            </View>
          </View>
        );

      case 'q4_ign':
        return (
          <View style={styles.contentSection}>
            <View style={styles.dialogueBox}>
              <Text style={styles.dialogueText}>
                Thank you so much for letting us know! Let's move to game stuffs now! May we ask for your In Game Name?
              </Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>In Game Name (IGN)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="game-controller-outline" size={20} color={Theme.colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Special characters allowed! e.g. ꧁༺EXALTED༻꧂, [EX]Val"
                  placeholderTextColor={Theme.colors.textPlaceholder}
                  value={answers.ign}
                  onChangeText={(val) => {
                    setAnswers((prev) => ({ ...prev, ign: val }));
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoFocus
                  returnKeyType="next"
                  onSubmitEditing={handleNext}
                />
              </View>
              <View style={styles.ignSupportBadge}>
                <Ionicons name="information-circle-outline" size={16} color={Theme.colors.primary} />
                <Text style={styles.ignSupportText}>
                  Special fonts, clan tags, symbols, Japanese/Korean/Chinese glyphs, and emojis are all permitted!
                </Text>
              </View>
            </View>
          </View>
        );

      case 'q5_uid':
        return (
          <View style={styles.contentSection}>
            <View style={styles.dialogueBox}>
              <Text style={styles.dialogueText}>
                That's one heck of a cool in game name, <Text style={styles.dialogueHighlight}>{ignDisplay}</Text>! Next, may we ask for your UID so we can verify your IGN?
              </Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Game UID (User Identification Number)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="finger-print-outline" size={20} color={Theme.colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 104829103"
                  placeholderTextColor={Theme.colors.textPlaceholder}
                  value={answers.uid}
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    setAnswers((prev) => ({ ...prev, uid: val }));
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoFocus
                  returnKeyType="next"
                  onSubmitEditing={handleNext}
                />
              </View>
              <Text style={styles.helperText}>
                🔍 We use this to inspect your profile stats and verify ownership of your IGN.
              </Text>
            </View>
          </View>
        );

      case 'q6_playstyle':
        return (
          <View style={styles.contentSection}>
            <View style={styles.dialogueBox}>
              <Text style={styles.dialogueText}>
                Thanks! We will verify that later, please don't use streamer mode while there is no admin who told you to do so yet, we are looking into this for you so this shouldn't take long!
                {'\n\n'}
                Next, may we kindly ask if you would like to play with us casually or would you like to go on the frontline and fight for our honor?
              </Text>
            </View>

            <View style={styles.inputWrapper}>
              <PlayStyleSelector
                value={answers.playStyle}
                onSelect={(val) => {
                  setAnswers((prev) => ({ ...prev, playStyle: val }));
                  if (errorMessage) setErrorMessage('');
                }}
              />
            </View>
          </View>
        );

      case 'q7_source':
        return (
          <View style={styles.contentSection}>
            <View style={styles.dialogueBox}>
              <Text style={styles.dialogueText}>
                Great! May we kindly ask how you heard about us?
              </Text>
            </View>

            <View style={styles.inputWrapper}>
              <ReferralSourceSelector
                value={answers.referralSource}
                onSelect={(val) => {
                  setAnswers((prev) => ({ ...prev, referralSource: val }));
                  if (errorMessage) setErrorMessage('');
                }}
              />
            </View>
          </View>
        );

      case 'q8_detail':
        if (answers.referralSource === 'referred') {
          return (
            <View style={styles.contentSection}>
              <View style={styles.dialogueBox}>
                <Text style={styles.dialogueText}>
                  I see! May we kindly ask the name of your referree so we can commend them for inviting an interesting person such as yourself?
                </Text>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.fieldLabel}>Referee's Name or IGN</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="ribbon-outline" size={20} color={Theme.colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Sentinel, FrostByte, or their nickname..."
                    placeholderTextColor={Theme.colors.textPlaceholder}
                    value={answers.refereeName}
                    onChangeText={(val) => {
                      setAnswers((prev) => ({ ...prev, refereeName: val }));
                      if (errorMessage) setErrorMessage('');
                    }}
                    autoFocus
                    returnKeyType="next"
                    onSubmitEditing={handleNext}
                  />
                </View>
                <Text style={styles.helperText}>
                  🌟 We award commendation points to members who introduce exceptional talent!
                </Text>
              </View>
            </View>
          );
        } else {
          return (
            <View style={styles.contentSection}>
              <View style={styles.dialogueBox}>
                <Text style={styles.dialogueText}>
                  Oh wow! I didn't expect that other people will see our posts! Could you please let me know if you see the media posted by our page or was it reposted by someone? If reposted, could you please let us know who reposted it? We are curious to know who is making us shine!
                </Text>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.fieldLabel}>Media Details / Reposter Info</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="megaphone-outline" size={20} color={Theme.colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Seen on TikTok / Reposted by @username / Official page"
                    placeholderTextColor={Theme.colors.textPlaceholder}
                    value={answers.mediaDetails}
                    onChangeText={(val) => {
                      setAnswers((prev) => ({ ...prev, mediaDetails: val }));
                      if (errorMessage) setErrorMessage('');
                    }}
                    autoFocus
                    returnKeyType="next"
                    onSubmitEditing={handleNext}
                  />
                </View>

                {/* Quick suggestions */}
                <View style={styles.quickTagsRow}>
                  {['Official Exalted Page', 'TikTok Highlight', 'Discord Server', 'Facebook Clip'].map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      activeOpacity={0.7}
                      onPress={() => {
                        playPop();
                        setAnswers((prev) => ({
                          ...prev,
                          mediaDetails: prev.mediaDetails ? `${prev.mediaDetails}, ${tag}` : tag,
                        }));
                      }}
                      style={styles.quickTagBtn}
                    >
                      <Text style={styles.quickTagText}>+ {tag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          );
        }

      case 'outro':
        return (
          <View style={styles.contentSection}>
            <ConfettiEffect active={true} />

            <View style={styles.dialogueBox}>
              <Text style={styles.dialogueText}>
                Thank you so much for answering all of my silly questions! Please patiently wait for the admin to talk to you regarding you admission.
                {'\n\n'}
                Keep it between us, <Text style={styles.dialogueHighlight}>{applicantName}</Text>. I think you have a high chance of getting in. I will congratulate you in advanced, welcome aboard! I hope you get along with all of us!
              </Text>
            </View>

            {/* Application Dossier Card */}
            <View style={styles.dossierCard}>
              <View style={styles.dossierHeader}>
                <Ionicons name="document-text" size={18} color={Theme.colors.primary} />
                <Text style={styles.dossierTitle}>Candidate Dossier Summary</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>READY TO REVIEW</Text>
                </View>
              </View>

              <View style={styles.dossierDivider} />

              <View style={styles.dossierGrid}>
                <View style={styles.dossierRow}>
                  <Text style={styles.dossierLabel}>Preferred Name</Text>
                  <Text style={styles.dossierValue}>{answers.name || '—'}</Text>
                </View>

                <View style={styles.dossierRow}>
                  <Text style={styles.dossierLabel}>Date of Birth</Text>
                  <Text style={styles.dossierValue}>
                    {answers.birthMonth}/{answers.birthDay}/{answers.birthYear || '—'}
                  </Text>
                </View>

                <View style={styles.dossierRow}>
                  <Text style={styles.dossierLabel}>Phone Contact</Text>
                  <Text style={styles.dossierValue}>{answers.phone || '—'}</Text>
                </View>

                <View style={styles.dossierRow}>
                  <Text style={styles.dossierLabel}>In Game Name</Text>
                  <Text style={[styles.dossierValue, { color: Theme.colors.primary, fontWeight: '700' }]}>
                    {answers.ign || '—'}
                  </Text>
                </View>

                <View style={styles.dossierRow}>
                  <Text style={styles.dossierLabel}>UID</Text>
                  <Text style={styles.dossierValue}>{answers.uid || '—'}</Text>
                </View>

                <View style={styles.dossierRow}>
                  <Text style={styles.dossierLabel}>Playstyle</Text>
                  <Text style={styles.dossierValue}>
                    {answers.playStyle === 'casual' ? '🌸 Casual Hangout' : '⚔️ Competitive Frontline'}
                  </Text>
                </View>

                <View style={styles.dossierRow}>
                  <Text style={styles.dossierLabel}>Referral Source</Text>
                  <Text style={styles.dossierValue}>
                    {answers.referralSource === 'referred'
                      ? `Referred by: ${answers.refereeName}`
                      : `Media: ${answers.mediaDetails}`}
                  </Text>
                </View>
              </View>

              <View style={styles.dossierActions}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCopySummary}
                  style={styles.copyButton}
                >
                  <Ionicons
                    name={copied ? 'checkmark-circle' : 'copy-outline'}
                    size={16}
                    color={copied ? Theme.colors.success : Theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.copyButtonText,
                      copied && { color: Theme.colors.success },
                    ]}
                  >
                    {copied ? 'Copied to Clipboard! ✨' : 'Copy Application Summary'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => transitionToStep(1)}
                  style={styles.editButton}
                >
                  <Ionicons name="create-outline" size={16} color={Theme.colors.textMuted} />
                  <Text style={styles.editButtonText}>Review / Edit Answers</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submission Status */}
            {submitted ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={26} color={Theme.colors.success} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.successTitle}>Application Submitted Successfully!</Text>
                  <Text style={styles.successSub}>
                    Our Clan Admins will contact you shortly via phone or social media. Welcome aboard!
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ width: '100%', gap: 10 }}>
                {submitError.length > 0 && (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={18} color={Theme.colors.error} />
                    <Text style={styles.errorText}>{submitError}</Text>
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSubmitFinal}
                  disabled={isSubmitting}
                  style={[
                    styles.primaryActionButton,
                    isSubmitting && { opacity: 0.8 },
                  ]}
                >
                  {isSubmitting ? (
                    <>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.primaryActionText}>Submitting to Member Log...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
                      <Text style={styles.primaryActionText}>Submit Official Application</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  const isIntro = currentStep === 'intro';
  const isOutro = currentStep === 'outro';
  const stepNumber = currentStepIndex; // 1 to 8

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading && (
        <LoadingScreen
          onDismiss={() => setIsLoading(false)}
          showDismiss={true}
        />
      )}

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Card Container */}
          <View style={styles.mainCard}>
            {/* Top Bar with Clan Emblem & Sound Toggle */}
            <View style={styles.topBar}>
              <View style={styles.brandRow}>
                <View style={styles.crestCircle}>
                  <Text style={styles.crestIcon}>⚜️</Text>
                </View>
                <View>
                  <Text style={styles.brandTitle}>EXALTED CLAN</Text>
                  <Text style={styles.brandSub}>Interview Assistant</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setIsLoading(true)}
                  style={styles.panicBtn}
                  accessibilityLabel="View panicking assistant loading screen"
                >
                  <Text style={styles.panicBtnText}>⚡ PANIC</Text>
                </TouchableOpacity>
                <SoundToggle />
              </View>
            </View>

            {/* Progress Bar (Visible during questions 1-8) */}
            {!isIntro && (
              <ProgressBar
                currentStep={isOutro ? 9 : stepNumber}
                totalSteps={8}
                stepTitle={
                  currentStep === 'q1_name'
                    ? 'Name'
                    : currentStep === 'q2_birthdate'
                      ? 'Birthday'
                      : currentStep === 'q3_phone'
                        ? 'Contact'
                        : currentStep === 'q4_ign'
                          ? 'IGN'
                          : currentStep === 'q5_uid'
                            ? 'UID'
                            : currentStep === 'q6_playstyle'
                              ? 'Playstyle'
                              : currentStep === 'q7_source'
                                ? 'Source'
                                : currentStep === 'q8_detail'
                                  ? 'Details'
                                  : 'Conclusion'
                }
              />
            )}

            {/* Mascot Avatar */}
            <View style={styles.avatarSection}>
              <AssistantAvatar mood={getAssistantMood()} size={114} />
              <View style={styles.nameplate}>
                <View style={styles.onlineDot} />
                <Text style={styles.nameplateText}>Exalted Interview Assistant</Text>
              </View>
            </View>

            {/* Animated Question & Content Card */}
            <Animated.View
              style={[
                styles.animatedCardBody,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {renderQuestionBody()}
            </Animated.View>

            {/* Validation Error Message */}
            {errorMessage.length > 0 && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={Theme.colors.error} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Navigation Footer for Question Steps */}
            {!isIntro && !isOutro && (
              <View style={styles.navigationFooter}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={handleBack}
                  style={styles.backButton}
                  accessibilityLabel="Go back to previous question"
                >
                  <Ionicons name="arrow-back" size={18} color={Theme.colors.textSecondary} />
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleNext}
                  style={styles.nextButton}
                  accessibilityLabel="Continue to next question"
                >
                  <Text style={styles.nextButtonText}>Next Question</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            {/* Desktop helper tip */}
            {Platform.OS === 'web' && !isOutro && (
              <View style={styles.desktopHintRow}>
                <Text style={styles.desktopHintText}>
                  💡 Press <Text style={styles.keyTag}>Enter ↵</Text> to advance •{' '}
                  <Text style={styles.keyTag}>Esc</Text> to go back
                </Text>
              </View>
            )}
          </View>

          {/* Footer note */}
          <View style={styles.pageFooter}>
            <Text style={styles.footerNote}>
              Exalted Clan • Honor • Brotherhood • Excellence
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCard: {
    width: '100%',
    maxWidth: 640,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radii.xl,
    padding: 24,
    borderWidth: 1.5,
    borderColor: Theme.colors.cardBorder,
    shadowColor: Theme.colors.cardGlow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 4,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.cardBorder,
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  crestCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorderHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crestIcon: {
    fontSize: 18,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.primary,
    letterSpacing: 1.2,
  },
  brandSub: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    letterSpacing: 0.4,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  nameplate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.badgeBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Theme.radii.full,
    marginTop: 8,
    gap: 6,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Theme.colors.accentSage,
  },
  nameplateText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.badgeText,
    letterSpacing: 0.3,
  },
  animatedCardBody: {
    width: '100%',
    marginVertical: 8,
  },
  contentSection: {
    width: '100%',
  },
  dialogueBox: {
    backgroundColor: Theme.colors.bgWarmGradientStart,
    borderWidth: 1.5,
    borderColor: Theme.colors.cardBorder,
    borderRadius: Theme.radii.lg,
    padding: 18,
    marginBottom: 20,
    position: 'relative',
    shadowColor: '#4A3525',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  dialogueText: {
    fontSize: 16,
    lineHeight: 24,
    color: Theme.colors.textPrimary,
    fontWeight: '500',
  },
  dialogueHighlight: {
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  introPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
    justifyContent: 'center',
  },
  introPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
    borderRadius: Theme.radii.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  introPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.inputBg,
    borderWidth: 1.5,
    borderColor: Theme.colors.inputBorder,
    borderRadius: Theme.radii.md,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Theme.colors.textPrimary,
    height: '100%',
    outlineStyle: 'none' as any,
  },
  clearBtn: {
    padding: 6,
  },
  helperText: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 6,
    lineHeight: 16,
  },
  badgeHint: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Theme.colors.accentSageLight,
    borderRadius: Theme.radii.sm,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.accentSage,
  },
  badgeHintText: {
    fontSize: 13,
    color: Theme.colors.accentSage,
  },
  ignSupportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Theme.colors.primaryLight,
    padding: 10,
    borderRadius: Theme.radii.md,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorderHover,
  },
  ignSupportText: {
    flex: 1,
    fontSize: 12,
    color: Theme.colors.primary,
    lineHeight: 16,
  },
  quickTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  quickTagBtn: {
    backgroundColor: Theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
    borderRadius: Theme.radii.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: Theme.radii.full,
    gap: 10,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 4,
    marginTop: 6,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  navigationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.cardBorder,
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: Theme.radii.full,
    backgroundColor: Theme.colors.bgSecondary,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
    gap: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: Theme.radii.full,
    backgroundColor: Theme.colors.primary,
    gap: 8,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.errorLight,
    borderWidth: 1,
    borderColor: Theme.colors.error,
    borderRadius: Theme.radii.md,
    padding: 10,
    marginTop: 10,
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.error,
    flex: 1,
  },
  dossierCard: {
    backgroundColor: Theme.colors.inputBg,
    borderRadius: Theme.radii.lg,
    borderWidth: 1.5,
    borderColor: Theme.colors.cardBorder,
    padding: 16,
    marginBottom: 20,
  },
  dossierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dossierTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: Theme.colors.accentGoldLight,
    borderWidth: 1,
    borderColor: Theme.colors.accentGold,
    borderRadius: Theme.radii.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Theme.colors.accentGold,
    letterSpacing: 0.5,
  },
  dossierDivider: {
    height: 1,
    backgroundColor: Theme.colors.cardBorder,
    marginVertical: 12,
  },
  dossierGrid: {
    gap: 8,
  },
  dossierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  dossierLabel: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    fontWeight: '500',
  },
  dossierValue: {
    fontSize: 13,
    color: Theme.colors.textPrimary,
    fontWeight: '600',
  },
  dossierActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.cardBorder,
  },
  copyButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorderHover,
    borderRadius: Theme.radii.md,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 6,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
    borderRadius: Theme.radii.md,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 6,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.accentSageLight,
    borderWidth: 1.5,
    borderColor: Theme.colors.accentSage,
    borderRadius: Theme.radii.lg,
    padding: 16,
    gap: 12,
  },
  successTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.accentSage,
  },
  successSub: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  desktopHintRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  desktopHintText: {
    fontSize: 11,
    color: Theme.colors.textPlaceholder,
  },
  keyTag: {
    fontWeight: '700',
    color: Theme.colors.textMuted,
  },
  pageFooter: {
    marginTop: 18,
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  panicBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Theme.radii.full,
    backgroundColor: '#FDEEE9',
    borderWidth: 1,
    borderColor: '#E8A395',
  },
  panicBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B84534',
    letterSpacing: 0.5,
  },
});
