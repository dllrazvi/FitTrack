import React, {useState, useEffect, useMemo, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Share,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  launchImageLibrary,
  type Asset,
} from 'react-native-image-picker';
import Video from 'react-native-video';
import {getAuth, onAuthStateChanged} from '@react-native-firebase/auth';
import {
  listenCommunityFeed,
  createCommunityPost,
  deleteCommunityPost,
  togglePostLike,
  addPostComment,
  deletePostComment,
  FeedPost,
} from '../../../../src/services/CommunityFirestoreService';
import {
  uploadCommunityPostImage,
  uploadCommunityPostVideo,
} from '../../../../src/services/communityMediaUpload';
import {
  seedCommunityChallengesIfEmpty,
  subscribeCommunityChallenges,
  joinCommunityChallenge,
  hasJoinedCommunityChallenge,
  createCommunityChallenge,
  updateCommunityChallenge,
  deleteCommunityChallenge,
  type UiChallenge,
} from '../../../../src/services/communityChallengesFirestore';
import {
  syncAllJoinedChallengesProgress,
  subscribeMyJoinedChallengeParticipants,
  type ChallengeMetric,
} from '../../../../src/services/communityChallengeProgress';
import {
  useNotificationInbox,
  NotificationBellIcon,
} from '../../../../src/contexts/NotificationInboxContext';
import {
  syncMyPublicLeaderboardStats,
  ensureMyLeaderboardRowExists,
  subscribeLeaderboard,
  type LeaderboardRow,
} from '../../../../src/services/leaderboardFirestore';
import {
  computeUserBadges,
  type UiBadge,
} from '../../../../src/services/userBadgeComputation';
import {backfillChallengeRewardsFromProgress} from '../../../../src/services/challengeRewardsFirestore';
import {searchWgerExercisesForPicker} from '../../../../src/services/wgerExerciseCatalog';
import {resolveStackBack} from './stackBackHelper';
import {useScreenTopInset} from './useScreenTopInset';
import {useTheme} from '../../../../src/contexts/ThemeContext';
import {createCommunityStyles} from './communityScreenStyles';
import {
  CHALLENGE_BADGE_PRESETS,
  DEFAULT_CHALLENGE_BADGE_PRESET_ID,
  getChallengeBadgePresetById,
} from '../../../../src/constants/challengeBadgePresets';

const firebaseAuth = getAuth();

const MAX_POST_PHOTOS = 4;

const METRIC_OPTIONS: {key: ChallengeMetric; label: string}[] = [
  {key: 'weekly_exercises', label: 'Exercise count (this week)'},
  {key: 'streak_7', label: 'Workout streak (days)'},
  {key: 'calories_week', label: 'Calories burned (this week)'},
  {key: 'protein_week', label: 'Protein goal days (Mon–Sun)'},
];

const CommunityScreen = ({navigation}: any) => {
  const stackBack = resolveStackBack(navigation);
  const topInset = useScreenTopInset();
  const {unreadCount, openPanel, closePanel, panelOpen} = useNotificationInbox();
  const [activeTab, setActiveTab] = useState('feed');
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [userBadges, setUserBadges] = useState<UiBadge[]>([]);
  const [badgesLoading, setBadgesLoading] = useState(false);
  const [challenges, setChallenges] = useState<UiChallenge[]>([]);
  const [challengesError, setChallengesError] = useState<string | null>(null);

  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [createChallengeOpen, setCreateChallengeOpen] = useState(false);
  const [ccTitle, setCcTitle] = useState('');
  const [ccDesc, setCcDesc] = useState('');
  const [ccBadgePresetId, setCcBadgePresetId] = useState(
    DEFAULT_CHALLENGE_BADGE_PRESET_ID,
  );
  const [ccSubmitting, setCcSubmitting] = useState(false);
  const [ccMetric, setCcMetric] = useState<ChallengeMetric>('weekly_exercises');
  const [ccTargetNumber, setCcTargetNumber] = useState('30');
  const [ccExerciseSearch, setCcExerciseSearch] = useState('');
  const [ccSearchResults, setCcSearchResults] = useState<{id: string; name: string}[]>(
    [],
  );
  const [ccSearchLoading, setCcSearchLoading] = useState(false);
  const [ccSelectedExerciseIds, setCcSelectedExerciseIds] = useState<string[]>(
    [],
  );

  const [editChallengeOpen, setEditChallengeOpen] = useState(false);
  const [editChallengeId, setEditChallengeId] = useState<string | null>(null);
  const [editChallengeMetric, setEditChallengeMetric] = useState<string>(
    'weekly_exercises',
  );
  const [ecTitle, setEcTitle] = useState('');
  const [ecDesc, setEcDesc] = useState('');
  const [ecBadgePresetId, setEcBadgePresetId] = useState(
    DEFAULT_CHALLENGE_BADGE_PRESET_ID,
  );
  const [ecTarget, setEcTarget] = useState('');
  const [ecSubmitting, setEcSubmitting] = useState(false);

  const [communityFeed, setCommunityFeed] = useState<FeedPost[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [composeImageAssets, setComposeImageAssets] = useState<Asset[]>([]);
  const [composeVideoAsset, setComposeVideoAsset] = useState<Asset | null>(null);
  const [composeChallengeShare, setComposeChallengeShare] =
    useState<UiChallenge | null>(null);
  const [posting, setPosting] = useState(false);

  const mainScrollRef = useRef<ScrollView>(null);
  const challengeCardLayoutsRef = useRef<Record<string, number>>({});
  const [focusedChallengeId, setFocusedChallengeId] = useState<string | null>(
    null,
  );

  const {theme, isDark} = useTheme();
  const styles = useMemo(
    () => createCommunityStyles(theme, isDark),
    [theme, isDark],
  );

  useEffect(() => {
    setFeedLoading(true);
    const unsub = listenCommunityFeed(
      posts => {
        setCommunityFeed(posts);
        setFeedError(null);
        setFeedLoading(false);
      },
      err => {
        setFeedError(err.message);
        setFeedLoading(false);
      },
    );
    return unsub;
  }, []);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      try {
        await seedCommunityChallengesIfEmpty();
        if (cancelled) {
          return;
        }
        unsub = subscribeCommunityChallenges(
          list => {
            setChallenges(list);
            setChallengesError(null);
          },
          err => setChallengesError(err.message),
        );
      } catch (e) {
        setChallengesError(
          e instanceof Error ? e.message : 'Challenges load failed',
        );
      }
    })();
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  useEffect(() => {
    let unsubLb: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(firebaseAuth, u => {
      unsubLb?.();
      unsubLb = undefined;
      if (!u) {
        setLeaderboard([]);
        return;
      }
      (async () => {
        try {
          await ensureMyLeaderboardRowExists();
          await syncMyPublicLeaderboardStats();
        } catch (e) {
          console.warn('Leaderboard sync:', e);
        }
        unsubLb = subscribeLeaderboard(
          rows => setLeaderboard(rows),
          err => console.warn('Leaderboard:', err.message),
        );
      })();
    });
    return () => {
      unsubAuth();
      unsubLb?.();
    };
  }, []);

  const joinedChallengeKey = challenges
    .filter(c => c.joined)
    .map(c => c.id)
    .sort()
    .join(',');

  const challengesProgressKey = useMemo(
    () =>
      challenges
        .map(c => `${c.id}:${c.progress ?? 0}:${c.joined ? 1 : 0}`)
        .sort()
        .join('|'),
    [challenges],
  );

  useEffect(() => {
    const uid = firebaseAuth.currentUser?.uid;
    if (
      (activeTab !== 'challenges' && activeTab !== 'badges') ||
      !uid ||
      !joinedChallengeKey
    ) {
      return;
    }
    const ids = joinedChallengeKey.split(',').filter(Boolean);
    syncAllJoinedChallengesProgress(ids).catch(() => {});
  }, [activeTab, joinedChallengeKey]);

  useEffect(() => {
    const uid = firebaseAuth.currentUser?.uid;
    if (
      (activeTab !== 'challenges' && activeTab !== 'badges') ||
      !uid ||
      !joinedChallengeKey
    ) {
      return undefined;
    }
    const ids = joinedChallengeKey.split(',').filter(Boolean);
    const unsub = subscribeMyJoinedChallengeParticipants(uid, ids, (cid, patch) => {
      setChallenges(prev =>
        prev.map(ch => (ch.id === cid ? {...ch, ...patch} : ch)),
      );
    });
    return unsub;
  }, [activeTab, joinedChallengeKey]);

  useEffect(() => {
    if (activeTab !== 'badges') {
      return;
    }
    const uid = firebaseAuth.currentUser?.uid;
    if (!uid) {
      setUserBadges([]);
      return;
    }
    let cancelled = false;
    setBadgesLoading(true);
    const joinedDone = challenges
      .filter(c => c.joined && c.progress >= 100)
      .map(c => ({
        id: c.id,
        title: c.title,
        reward: c.reward,
        progress: c.progress,
        badgePresetId: c.badgePresetId,
      }));
    backfillChallengeRewardsFromProgress(uid, joinedDone)
      .catch(e => console.warn('backfillChallengeRewardsFromProgress', e))
      .then(() => computeUserBadges(uid))
      .then(list => {
        if (!cancelled) {
          setUserBadges(list);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUserBadges([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setBadgesLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab, challenges, challengesProgressKey]);

  useEffect(() => {
    if (!createChallengeOpen || ccMetric !== 'weekly_exercises') {
      return;
    }
    const q = ccExerciseSearch.trim();
    let cancelled = false;
    setCcSearchLoading(true);
    const t = setTimeout(() => {
      searchWgerExercisesForPicker(q || 'push', 18)
        .then(rows => {
          if (!cancelled) {
            setCcSearchResults(rows);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setCcSearchResults([]);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setCcSearchLoading(false);
          }
        });
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [createChallengeOpen, ccMetric, ccExerciseSearch]);

  useEffect(() => {
    if (activeTab !== 'leaderboard') {
      return;
    }
    if (!firebaseAuth.currentUser?.uid) {
      return;
    }
    syncMyPublicLeaderboardStats().catch(() => {});
  }, [activeTab]);

  const joinChallenge = async (challengeId: string) => {
    try {
      await joinCommunityChallenge(challengeId);
    } catch (e) {
      const joined = await hasJoinedCommunityChallenge(challengeId);
      if (!joined) {
        Alert.alert(
          'Challenge',
          e instanceof Error ? e.message : 'Could not join this challenge.',
        );
        return;
      }
    }
    try {
      await syncAllJoinedChallengesProgress([challengeId]);
    } catch (_) {}
  };

  const resetCreateChallengeForm = () => {
    setCcTitle('');
    setCcDesc('');
    setCcBadgePresetId(DEFAULT_CHALLENGE_BADGE_PRESET_ID);
    setCcMetric('weekly_exercises');
    setCcTargetNumber('30');
    setCcExerciseSearch('');
    setCcSearchResults([]);
    setCcSelectedExerciseIds([]);
  };

  const submitCreateChallenge = async () => {
    if (
      !ccTitle.trim() ||
      !ccDesc.trim() ||
      !getChallengeBadgePresetById(ccBadgePresetId)
    ) {
      Alert.alert(
        'Missing fields',
        'Please fill in title, description, and choose a badge for finishers.',
      );
      return;
    }
    const n = parseInt(ccTargetNumber, 10);
    const targetNum = Number.isFinite(n) && n > 0 ? n : 30;
    setCcSubmitting(true);
    try {
      const challengeId = await createCommunityChallenge({
        title: ccTitle,
        description: ccDesc,
        badgePresetId: ccBadgePresetId,
        metricType: ccMetric,
        targetTotalExercises:
          ccMetric === 'weekly_exercises' ? targetNum : undefined,
        targetCalories: ccMetric === 'calories_week' ? targetNum : undefined,
        targetStreakDays: ccMetric === 'streak_7' ? targetNum : undefined,
        selectedExerciseIds:
          ccMetric === 'weekly_exercises' ? ccSelectedExerciseIds : [],
      });
      try {
        await joinCommunityChallenge(challengeId);
      } catch (_) {
        const joined = await hasJoinedCommunityChallenge(challengeId);
        if (!joined) {
          throw new Error(
            'Challenge created, but auto-join failed. Tap "Join Challenge" once and retry.',
          );
        }
      }
      try {
        await syncAllJoinedChallengesProgress([challengeId]);
      } catch (_) {
        // Sync retries internally; badges tab also triggers a backfill pass.
      }
      resetCreateChallengeForm();
      setCreateChallengeOpen(false);
    } catch (e: any) {
      Alert.alert(
        'Create challenge',
        e?.message || 'Could not create challenge.',
      );
    } finally {
      setCcSubmitting(false);
    }
  };

  const openEditChallenge = (ch: UiChallenge) => {
    setEditChallengeId(ch.id);
    setEditChallengeMetric(
      (ch.metricType as string) || 'weekly_exercises',
    );
    setEcTitle(ch.title);
    setEcDesc(ch.description);
    setEcBadgePresetId(
      ch.badgePresetId?.trim() || DEFAULT_CHALLENGE_BADGE_PRESET_ID,
    );
    if (ch.metricType === 'calories_week') {
      setEcTarget(String(ch.targetCalories ?? 2000));
    } else if (ch.metricType === 'streak_7') {
      setEcTarget(String(ch.targetStreakDays ?? 7));
    } else {
      setEcTarget(String(ch.targetTotalExercises ?? 30));
    }
    setEditChallengeOpen(true);
  };

  const resetEditChallengeForm = () => {
    setEditChallengeId(null);
    setEditChallengeMetric('weekly_exercises');
    setEcTitle('');
    setEcDesc('');
    setEcBadgePresetId(DEFAULT_CHALLENGE_BADGE_PRESET_ID);
    setEcTarget('');
    setEditChallengeOpen(false);
  };

  const submitEditChallenge = async () => {
    if (
      !editChallengeId ||
      !ecTitle.trim() ||
      !ecDesc.trim() ||
      !getChallengeBadgePresetById(ecBadgePresetId)
    ) {
      Alert.alert(
        'Missing fields',
        'Fill in title, description, and choose a badge.',
      );
      return;
    }
    const n = parseInt(ecTarget, 10);
    const targetNum = Number.isFinite(n) && n > 0 ? n : 30;
    setEcSubmitting(true);
    try {
      const patch: {
        title?: string;
        description?: string;
        badgePresetId?: string;
        targetTotalExercises?: number;
        targetCalories?: number;
        targetStreakDays?: number;
      } = {
        title: ecTitle,
        description: ecDesc,
        badgePresetId: ecBadgePresetId,
      };
      if (editChallengeMetric === 'weekly_exercises') {
        patch.targetTotalExercises = targetNum;
      } else if (editChallengeMetric === 'calories_week') {
        patch.targetCalories = targetNum;
      } else if (editChallengeMetric === 'streak_7') {
        patch.targetStreakDays = targetNum;
      }
      await updateCommunityChallenge(editChallengeId, patch);
      resetEditChallengeForm();
    } catch (e: any) {
      Alert.alert('Edit challenge', e?.message || 'Could not save.');
    } finally {
      setEcSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await togglePostLike(postId);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not update like.');
    }
  };

  const handleComment = async (postId: string) => {
    if (!commentText.trim()) {
      return;
    }
    try {
      await addPostComment(postId, commentText.trim());
      setCommentText('');
      setShowCommentInput(null);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not save comment.');
    }
  };

  const handleSharePost = async (item: FeedPost) => {
    try {
      let message = `${item.authorName} (FitTrack Community):\n${item.body}`;
      if (item.sharedChallenge) {
        message += `\n\nChallenge: ${item.sharedChallenge.title}`;
        if (item.sharedChallenge.reward?.trim()) {
          message += `\nReward: ${item.sharedChallenge.reward}`;
        }
      }
      if (item.imageUrls?.length) {
        message += `\n\n${item.imageUrls.join('\n')}`;
      }
      if (item.videoUrl) {
        message += `\n\n${item.videoUrl}`;
      }
      await Share.share({message});
    } catch (_) {}
  };

  const closeComposeModal = () => {
    setComposeOpen(false);
    setComposeText('');
    setComposeImageAssets([]);
    setComposeVideoAsset(null);
    setComposeChallengeShare(null);
  };

  const openShareChallengeToFeed = (challenge: UiChallenge) => {
    const uid = firebaseAuth.currentUser?.uid;
    if (!uid) {
      Alert.alert(
        'Sign in',
        'Please sign in to share a challenge on the community feed.',
      );
      return;
    }
    setComposeChallengeShare(challenge);
    setComposeText('');
    setComposeImageAssets([]);
    setComposeVideoAsset(null);
    setActiveTab('feed');
    setComposeOpen(true);
  };

  const openChallengeFromFeed = (challengeId: string) => {
    const exists = challenges.some(c => c.id === challengeId);
    setActiveTab('challenges');
    setFocusedChallengeId(challengeId);
    if (!exists) {
      setTimeout(() => {
        Alert.alert(
          'Challenge unavailable',
          'This challenge may have been removed. Browse the list below for active challenges.',
        );
      }, 600);
    }
  };

  useEffect(() => {
    if (!focusedChallengeId) {
      return;
    }
    const clear = setTimeout(() => setFocusedChallengeId(null), 4500);
    return () => clearTimeout(clear);
  }, [focusedChallengeId]);

  useEffect(() => {
    if (activeTab !== 'challenges' || !focusedChallengeId) {
      return;
    }
    const id = focusedChallengeId;
    mainScrollRef.current?.scrollTo({y: 0, animated: false});
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let attempts = 0;
    const tryScroll = (): void => {
      const y = challengeCardLayoutsRef.current[id];
      if (y != null && mainScrollRef.current) {
        mainScrollRef.current.scrollTo({
          y: Math.max(0, y - 12),
          animated: true,
        });
        return;
      }
      if (attempts < 12) {
        attempts += 1;
        timeouts.push(setTimeout(tryScroll, 90));
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(tryScroll));
    return () => timeouts.forEach(clearTimeout);
  }, [activeTab, focusedChallengeId]);

  const pickComposePhotos = () => {
    if (composeVideoAsset) {
      setComposeVideoAsset(null);
    }
    const remaining = MAX_POST_PHOTOS - composeImageAssets.length;
    if (remaining <= 0) {
      Alert.alert('Limit', `You can add up to ${MAX_POST_PHOTOS} photos per post.`);
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: remaining,
      },
      response => {
        if (response.didCancel || response.errorMessage) {
          return;
        }
        const assets = response.assets?.filter(a => a.uri) ?? [];
        if (!assets.length) {
          return;
        }
        setComposeImageAssets(prev =>
          [...prev, ...assets].slice(0, MAX_POST_PHOTOS),
        );
      },
    );
  };

  const removeComposePhotoAt = (index: number) => {
    setComposeImageAssets(prev => prev.filter((_, i) => i !== index));
  };

  const pickComposeVideo = () => {
    if (composeImageAssets.length > 0) {
      setComposeImageAssets([]);
    }
    launchImageLibrary(
      {
        mediaType: 'video',
        selectionLimit: 1,
        videoQuality: 'high',
      },
      response => {
        if (response.didCancel || response.errorMessage) {
          return;
        }
        const asset = response.assets?.[0];
        if (!asset?.uri) {
          return;
        }
        setComposeVideoAsset(asset);
      },
    );
  };

  const openPostMenu = (item: FeedPost) => {
    const uid = firebaseAuth.currentUser?.uid;
    const isAuthor = uid && item.authorId === uid;
    const buttons: {
      text: string;
      onPress?: () => void;
      style?: 'cancel' | 'destructive';
    }[] = [
      {text: 'Share', onPress: () => { handleSharePost(item); }},
      ...(isAuthor
        ? [
            {
              text: 'Delete post',
              style: 'destructive' as const,
              onPress: () => {
                Alert.alert(
                  'Delete this post?',
                  'This cannot be undone.',
                  [
                    {text: 'Cancel', style: 'cancel'},
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await deleteCommunityPost(item.id);
                        } catch (e: any) {
                          Alert.alert(
                            'Error',
                            e?.message || 'Delete failed.',
                          );
                        }
                      },
                    },
                  ],
                );
              },
            },
          ]
        : []),
      {text: 'Close', style: 'cancel'},
    ];
    Alert.alert('Post', undefined, buttons);
  };

  const submitNewPost = async () => {
    const sharingChallenge = composeChallengeShare != null;
    if (
      !sharingChallenge &&
      !composeText.trim() &&
      composeImageAssets.length === 0 &&
      !composeVideoAsset?.uri
    ) {
      Alert.alert(
        'Empty',
        'Write something, add a photo, or add a short video (max ~2 min).',
      );
      return;
    }
    setPosting(true);
    try {
      let videoUrl: string | undefined;
      if (composeVideoAsset?.uri) {
        videoUrl = await uploadCommunityPostVideo(
          composeVideoAsset.uri,
          composeVideoAsset.type,
        );
      }
      const imageUrls: string[] = [];
      for (const asset of composeImageAssets) {
        if (!asset.uri) {
          continue;
        }
        const url = await uploadCommunityPostImage(asset.uri, asset.type);
        imageUrls.push(url);
      }
      await createCommunityPost({
        body: composeText,
        imageUrls,
        ...(videoUrl ? {videoUrl} : {}),
        ...(composeChallengeShare
          ? {
              sharedChallenge: {
                id: composeChallengeShare.id,
                title: composeChallengeShare.title,
                reward: composeChallengeShare.reward,
              },
            }
          : {}),
      });
      closeComposeModal();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not publish post.');
    } finally {
      setPosting(false);
    }
  };

  const renderTabButton = (tab: string, label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}>
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text
        style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderFeedItem = (item: FeedPost) => (
    <View key={item.id} style={styles.feedItem}>
      <View style={styles.feedHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{item.authorInitial}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.authorName}</Text>
            <Text style={styles.feedTime}>{item.relativeTime}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => openPostMenu(item)}>
          <Text style={styles.moreButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {item.sharedChallenge ? (
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.feedSharedChallenge}
          onPress={() => openChallengeFromFeed(item.sharedChallenge!.id)}
          accessibilityRole="button"
          accessibilityHint="Opens this challenge in the Challenges tab">
          <Text style={styles.feedSharedChallengeLabel}>CHALLENGE · TAP TO OPEN</Text>
          <Text style={styles.feedSharedChallengeTitle}>
            {item.sharedChallenge.title}
          </Text>
          {item.sharedChallenge.reward?.trim() ? (
            <Text style={styles.feedSharedChallengeReward}>
              Reward: {item.sharedChallenge.reward}
            </Text>
          ) : null}
        </TouchableOpacity>
      ) : null}

      {item.body.trim().length > 0 ? (
        <Text style={styles.feedContent}>{item.body}</Text>
      ) : null}

      {item.videoUrl ? (
        <View style={styles.feedVideoWrap}>
          <Video
            source={{uri: item.videoUrl}}
            style={styles.feedVideo}
            controls
            resizeMode="contain"
            paused
            ignoreSilentSwitch="ignore"
            playInBackground={false}
            playWhenInactive={false}
          />
        </View>
      ) : null}

      {item.imageUrls.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.feedImagesRow}>
          {item.imageUrls.map((uri, idx) => (
            <Image
              key={`${item.id}-img-${idx}`}
              source={{uri}}
              style={styles.feedImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      ) : null}

      {item.comments.length > 0 && (
        <View style={styles.commentsSection}>
          {item.comments.map(comment => (
            <View key={comment.id} style={styles.commentRow}>
              <View style={{flex: 1}}>
                <Text style={styles.commentUser}>{comment.authorName}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
                <Text style={styles.commentTime}>{comment.timeLabel}</Text>
              </View>
              {firebaseAuth.currentUser?.uid === comment.authorId && (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Delete this comment?',
                      undefined,
                      [
                        {text: 'Cancel', style: 'cancel'},
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await deletePostComment(item.id, comment.id);
                            } catch (e: any) {
                              Alert.alert(
                                'Error',
                                e?.message || 'Delete failed.',
                              );
                            }
                          },
                        },
                      ],
                    );
                  }}>
                  <Text style={styles.deleteComment}>🗑</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      {showCommentInput === item.id && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholderTextColor={theme.colors.placeholder}
            placeholder="Write a comment..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <View style={styles.commentInputActions}>
            <TouchableOpacity
              style={styles.cancelCommentButton}
              onPress={() => {
                setShowCommentInput(null);
                setCommentText('');
              }}>
              <Text style={styles.cancelCommentText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.postCommentButton}
              onPress={() => {
                handleComment(item.id);
              }}>
              <Text style={styles.postCommentText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.feedActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            item.likedByMe && styles.actionButtonActive,
          ]}
          onPress={() => {
            handleLike(item.id);
          }}>
          <Text
            style={[
              styles.actionIcon,
              item.likedByMe && styles.actionIconActive,
            ]}>
            {item.likedByMe ? '❤️' : '👍'}
          </Text>
          <Text
            style={[
              styles.actionText,
              item.likedByMe && styles.actionTextActive,
            ]}>
            {item.likesCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            setShowCommentInput(showCommentInput === item.id ? null : item.id)
          }>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{item.comments.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            handleSharePost(item);
          }}>
          <Text style={styles.actionIcon}>↗️</Text>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const toggleCcExercise = (id: string) => {
    setCcSelectedExerciseIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const confirmDeleteChallenge = (challengeId: string, title: string) => {
    Alert.alert(
      'Delete challenge?',
      `"${title}" will be removed for everyone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCommunityChallenge(challengeId);
            } catch (e: any) {
              Alert.alert(
                'Delete',
                e?.message || 'Could not delete challenge.',
              );
            }
          },
        },
      ],
    );
  };

  const renderChallenge = (challenge: UiChallenge) => {
    const uid = firebaseAuth.currentUser?.uid;
    const isCreator = uid && challenge.createdBy === uid;
    return (
      <View
        key={challenge.id}
        onLayout={e => {
          challengeCardLayoutsRef.current[challenge.id] =
            e.nativeEvent.layout.y;
        }}
        style={[
          styles.challengeCard,
          focusedChallengeId === challenge.id && styles.challengeCardFocused,
        ]}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeReward}>{challenge.reward}</Text>
        </View>
        <Text style={styles.challengeDescription}>{challenge.description}</Text>
        {challenge.selectedExerciseIds?.length ? (
          <Text style={styles.challengeMeta}>
            Focus exercises: {challenge.selectedExerciseIds.length} selected
            (progress uses total exercises logged this week)
          </Text>
        ) : null}
        <View style={styles.challengeStats}>
          <Text style={styles.challengeParticipants}>
            {challenge.participants} participants
          </Text>
          <Text style={styles.challengeProgress}>
            {challenge.joined
              ? `${challenge.progress}% complete`
              : 'Join to track progress'}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.joinChallengeButton,
            challenge.joined && styles.joinedChallengeButton,
          ]}
          onPress={() => (challenge.joined ? null : joinChallenge(challenge.id))}>
          <Text
            style={[
              styles.joinChallengeText,
              challenge.joined && styles.joinedChallengeText,
            ]}>
            {challenge.joined ? 'Joined' : 'Join Challenge'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareChallengeButton}
          onPress={() => openShareChallengeToFeed(challenge)}>
          <Text style={styles.shareChallengeButtonText}>Share to feed</Text>
        </TouchableOpacity>
        {isCreator ? (
          <View style={styles.creatorActions}>
            <TouchableOpacity
              style={styles.editChallengeBtn}
              onPress={() => openEditChallenge(challenge)}>
              <Text style={styles.editChallengeText}>Edit challenge</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteChallengeBtn}
              onPress={() =>
                confirmDeleteChallenge(challenge.id, challenge.title)
              }>
              <Text style={styles.deleteChallengeText}>Delete challenge</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  const renderLeaderboardItem = (item: LeaderboardRow, index: number) => (
    <View key={`${item.rank}-${item.name}-${index}`} style={styles.leaderboardItem}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankNumber}>{item.rank}</Text>
        {item.rank <= 3 && (
          <Text style={styles.rankMedal}>
            {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
          </Text>
        )}
      </View>
      <View style={styles.userStats}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userDetails}>
          {item.workouts} workouts this week · {item.streak} day streak
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {paddingTop: topInset}]}>
      <Modal visible={editChallengeOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit challenge</Text>
            <Text style={styles.fieldLabel}>Title</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputCompact]}
              placeholderTextColor={theme.colors.placeholder}
              value={ecTitle}
              onChangeText={setEcTitle}
              maxLength={120}
            />
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.modalInput, {minHeight: 80}]}
              placeholderTextColor={theme.colors.placeholder}
              value={ecDesc}
              onChangeText={setEcDesc}
              multiline
              maxLength={2000}
            />
            <Text style={styles.fieldLabel}>Badge for finishers</Text>
            <Text style={styles.helperText}>
              Anyone who completes this challenge earns the badge you pick below.
            </Text>
            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              style={{maxHeight: 200}}
              showsVerticalScrollIndicator={false}>
              {CHALLENGE_BADGE_PRESETS.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.metricChip,
                    ecBadgePresetId === p.id && styles.metricChipActive,
                  ]}
                  onPress={() => setEcBadgePresetId(p.id)}>
                  <View style={styles.badgePresetRow}>
                    <Text style={styles.badgePresetEmoji}>{p.icon}</Text>
                    <View style={styles.badgePresetMeta}>
                      <Text
                        style={[
                          styles.metricChipText,
                          ecBadgePresetId === p.id && styles.metricChipTextActive,
                        ]}>
                        {p.label}
                      </Text>
                      <Text style={styles.badgePresetSubLabel}>
                        {p.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {editChallengeMetric !== 'protein_week' ? (
              <>
                <Text style={styles.fieldLabel}>Target number</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalInputCompact]}
                  placeholderTextColor={theme.colors.placeholder}
                  value={ecTarget}
                  onChangeText={setEcTarget}
                  keyboardType="number-pad"
                />
              </>
            ) : (
              <Text style={styles.helperText}>
                Protein week uses your Nutrition protein goal (Mon–Sun).
              </Text>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelCommentButton}
                onPress={() => resetEditChallengeForm()}>
                <Text style={styles.cancelCommentText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.postCommentButton}
                onPress={() => submitEditChallenge()}
                disabled={ecSubmitting}>
                {ecSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.postCommentText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={createChallengeOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.createChallengeScroll}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Create challenge</Text>
              <Text style={styles.fieldLabel}>Goal type</Text>
              {METRIC_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.metricChip,
                    ccMetric === opt.key && styles.metricChipActive,
                  ]}
                  onPress={() => {
                    setCcMetric(opt.key);
                    if (opt.key === 'weekly_exercises') {
                      setCcTargetNumber('30');
                    } else if (opt.key === 'calories_week') {
                      setCcTargetNumber('2000');
                    } else if (opt.key === 'streak_7') {
                      setCcTargetNumber('7');
                    }
                  }}>
                  <Text
                    style={[
                      styles.metricChipText,
                      ccMetric === opt.key && styles.metricChipTextActive,
                    ]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
              {ccMetric !== 'protein_week' ? (
                <>
                  <Text style={styles.fieldLabel}>Target number</Text>
                  <TextInput
                    style={[styles.modalInput, styles.modalInputCompact]}
                    placeholderTextColor={theme.colors.placeholder}
                    placeholder={
                      ccMetric === 'calories_week'
                        ? 'Calories this week (e.g. 2000)'
                        : ccMetric === 'streak_7'
                          ? 'Consecutive days (e.g. 7)'
                          : 'Total exercises completed this week (e.g. 30)'
                    }
                    value={ccTargetNumber}
                    onChangeText={setCcTargetNumber}
                    keyboardType="number-pad"
                  />
                </>
              ) : (
                <Text style={styles.helperText}>
                  Uses your daily protein goal from Nutrition settings. Counts
                  Mon–Sun this week.
                </Text>
              )}
              {ccMetric === 'weekly_exercises' ? (
                <>
                  <Text style={styles.fieldLabel}>
                    Focus exercises (optional — progress still uses total
                    exercises you log this week)
                  </Text>
                  <TextInput
                    style={[styles.modalInput, styles.modalInputCompact]}
                    placeholderTextColor={theme.colors.placeholder}
                    placeholder="Search wger exercises…"
                    value={ccExerciseSearch}
                    onChangeText={setCcExerciseSearch}
                  />
                  {ccSearchLoading ? (
                    <ActivityIndicator color="#4ECDC4" style={{marginVertical: 8}} />
                  ) : null}
                  {ccSearchResults.map(row => {
                    const on = ccSelectedExerciseIds.includes(row.id);
                    return (
                      <TouchableOpacity
                        key={row.id}
                        style={[styles.exRow, on && styles.exRowOn]}
                        onPress={() => toggleCcExercise(row.id)}>
                        <Text style={styles.exRowText}>
                          {on ? '✓ ' : ''}
                          {row.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </>
              ) : null}
              <Text style={styles.fieldLabel}>Title</Text>
              <TextInput
                style={[styles.modalInput, styles.modalInputCompact]}
                placeholderTextColor={theme.colors.placeholder}
                placeholder="Title"
                value={ccTitle}
                onChangeText={setCcTitle}
                maxLength={120}
              />
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.modalInput, {minHeight: 80}]}
                placeholderTextColor={theme.colors.placeholder}
                placeholder="Description"
                value={ccDesc}
                onChangeText={setCcDesc}
                multiline
                maxLength={2000}
              />
              <Text style={styles.fieldLabel}>Badge for finishers</Text>
              <Text style={styles.helperText}>
                Everyone who completes this challenge unlocks this badge in Badges.
              </Text>
              <ScrollView
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                style={{maxHeight: 200}}
                showsVerticalScrollIndicator={false}>
                {CHALLENGE_BADGE_PRESETS.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.metricChip,
                      ccBadgePresetId === p.id && styles.metricChipActive,
                    ]}
                    onPress={() => setCcBadgePresetId(p.id)}>
                    <View style={styles.badgePresetRow}>
                      <Text style={styles.badgePresetEmoji}>{p.icon}</Text>
                      <View style={styles.badgePresetMeta}>
                        <Text
                          style={[
                            styles.metricChipText,
                            ccBadgePresetId === p.id &&
                              styles.metricChipTextActive,
                          ]}>
                          {p.label}
                        </Text>
                        <Text style={styles.badgePresetSubLabel}>
                          {p.description}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelCommentButton}
                  onPress={() => {
                    setCreateChallengeOpen(false);
                    resetCreateChallengeForm();
                  }}>
                  <Text style={styles.cancelCommentText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.postCommentButton}
                  onPress={() => {
                    submitCreateChallenge();
                  }}
                  disabled={ccSubmitting}>
                  {ccSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.postCommentText}>Create</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={composeOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.composeModalScroll}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {composeChallengeShare ? 'Share challenge' : 'New post'}
              </Text>
              <Text style={styles.composeSubtitle}>
                {composeChallengeShare
                  ? 'Add an optional note and/or photo. The challenge card is included automatically.'
                  : 'Share text, photos, or one short video from the gallery.'}
              </Text>
              {composeChallengeShare ? (
                <View style={styles.composeAttachedChallenge}>
                  <View style={styles.composeAttachedChallengeTextCol}>
                    <Text style={styles.composeAttachedLabel}>ATTACHED</Text>
                    <Text style={styles.composeAttachedTitle}>
                      {composeChallengeShare.title}
                    </Text>
                    {composeChallengeShare.reward?.trim() ? (
                      <Text style={styles.composeAttachedReward}>
                        Reward: {composeChallengeShare.reward}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => setComposeChallengeShare(null)}
                    disabled={posting}
                    hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                    <Text style={styles.composeAttachedRemove}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <Text style={styles.fieldLabel}>Your message</Text>
              <TextInput
                style={styles.modalInput}
                placeholderTextColor={theme.colors.placeholder}
                placeholder={
                  composeChallengeShare
                    ? 'Say why you like this challenge or invite friends… (optional)'
                    : 'What did you do in your workout today? (optional with photos or a video)'
                }
                value={composeText}
                onChangeText={setComposeText}
                multiline
                maxLength={2000}
              />
              <Text style={styles.fieldLabel}>Video (optional, one clip)</Text>
              <View style={styles.composeVideoRow}>
                <TouchableOpacity
                  style={styles.addPhotoBtn}
                  onPress={pickComposeVideo}
                  disabled={posting}>
                  <Text style={styles.addPhotoBtnText}>Add video from gallery</Text>
                </TouchableOpacity>
                {composeVideoAsset?.uri ? (
                  <View style={styles.composeVideoPill}>
                    <Text style={styles.composeVideoPillText} numberOfLines={1}>
                      {composeVideoAsset.fileName || 'Video selected'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setComposeVideoAsset(null)}
                      disabled={posting}>
                      <Text style={styles.composeVideoRemoveText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
              <Text style={styles.fieldLabel}>
                Photos (optional, max {MAX_POST_PHOTOS}; clears video if you add
                photos)
              </Text>
              <TouchableOpacity
                style={styles.addPhotoBtn}
                onPress={pickComposePhotos}
                disabled={posting}>
                <Text style={styles.addPhotoBtnText}>Add from gallery</Text>
              </TouchableOpacity>
              {composeImageAssets.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.composeThumbRow}>
                  {composeImageAssets.map((asset, index) => (
                    <View key={`${asset.uri}-${index}`} style={styles.composeThumbWrap}>
                      <Image
                        source={{uri: asset.uri!}}
                        style={styles.composeThumb}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.composeThumbRemove}
                        onPress={() => removeComposePhotoAt(index)}
                        disabled={posting}>
                        <Text style={styles.composeThumbRemoveText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              ) : null}
              {!composeChallengeShare ? (
                <Text style={styles.composeRoadmapHint}>
                  Tip: From Challenges, use Share to feed to post a challenge
                  card here with your own caption.
                </Text>
              ) : null}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelCommentButton}
                  onPress={closeComposeModal}>
                  <Text style={styles.cancelCommentText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.postCommentButton}
                  onPress={() => {
                    submitNewPost();
                  }}
                  disabled={posting}>
                  {posting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.postCommentText}>Publish</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          hitSlop={{top: 24, bottom: 24, left: 24, right: 24}}
          accessibilityRole="button"
          accessibilityLabel={stackBack.label}
          onPress={stackBack.onPress}>
          <Text style={styles.backButtonText}>{stackBack.label}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Community</Text>
        <NotificationBellIcon
          unreadCount={unreadCount}
          onPress={() => (panelOpen ? closePanel() : openPanel())}
        />
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton('feed', 'Feed', '📱')}
        {renderTabButton('challenges', 'Challenges', '🎯')}
        {renderTabButton('leaderboard', 'Leaderboard', '🏆')}
        {renderTabButton('badges', 'Badges', '🏅')}
      </View>

      <ScrollView
        ref={mainScrollRef}
        style={[styles.content, {flex: 1}]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {activeTab === 'feed' && (
          <View style={styles.feedContainer}>
            <View style={styles.feedHeaderRow}>
              <Text style={styles.sectionTitle}>Community Activity</Text>
              <TouchableOpacity
                style={styles.newPostBtn}
                onPress={() => {
                  setComposeChallengeShare(null);
                  setComposeOpen(true);
                }}>
                <Text style={styles.newPostBtnText}>+ New post</Text>
              </TouchableOpacity>
            </View>
            {feedLoading && (
              <ActivityIndicator size="large" color="#4ECDC4" style={{margin: 24}} />
            )}
            {feedError && (
              <Text style={styles.errorText}>
                Feed: {feedError}
                {'\n'}Check Firestore rules and the communityPosts collection.
              </Text>
            )}
            {!feedLoading && communityFeed.length === 0 && !feedError && (
              <Text style={styles.emptyFeed}>
                No posts yet. Tap “+ New post” to be the first.
              </Text>
            )}
            {communityFeed.map(renderFeedItem)}
          </View>
        )}

        {activeTab === 'challenges' && (
          <View style={styles.challengesContainer}>
            <View style={styles.feedHeaderRow}>
              <Text style={styles.sectionTitle}>Active Challenges</Text>
              <TouchableOpacity
                style={styles.newPostBtn}
                onPress={() => setCreateChallengeOpen(true)}>
                <Text style={styles.newPostBtnText}>+ Create</Text>
              </TouchableOpacity>
            </View>
            {challengesError ? (
              <Text style={styles.errorText}>{challengesError}</Text>
            ) : null}
            {challenges.map(renderChallenge)}
          </View>
        )}

        {activeTab === 'leaderboard' && (
          <View style={styles.leaderboardContainer}>
            <Text style={styles.sectionTitle}>This Week's Champions</Text>
            <Text style={styles.leaderboardSubtext}>
              Ordered by workouts completed this week. Challenge badges live under
              Badges.
            </Text>
            {leaderboard.length === 0 ? (
              <Text style={styles.emptyFeed}>
                No one on the board yet. Log a workout (or open this tab after
                training) so your stats sync to the leaderboard. Names come
                from your Google / account display name.
              </Text>
            ) : (
              leaderboard.map(renderLeaderboardItem)
            )}
          </View>
        )}

        {activeTab === 'badges' && (
          <View style={styles.badgesContainer}>
            <Text style={styles.sectionTitle}>Your Achievements</Text>
            {badgesLoading ? (
              <ActivityIndicator size="large" color="#4ECDC4" style={{margin: 24}} />
            ) : null}
            <View style={styles.badgesGrid}>
              {userBadges.map(badge => (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeCard,
                    badge.earned && styles.badgeCardEarned,
                  ]}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text
                    style={[
                      styles.badgeName,
                      badge.earned && styles.badgeNameEarned,
                    ]}>
                    {badge.name}
                  </Text>
                  <Text
                    style={[
                      styles.badgeDescription,
                      badge.earned && styles.badgeDescriptionEarned,
                    ]}>
                    {badge.description}
                  </Text>
                  {badge.earned && (
                    <Text style={styles.badgeEarnedDate}>
                      Earned: {badge.date}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CommunityScreen;
