import { Grid } from '@mui/material';
import {
  ArticleContentNoAvatar,
  Content,
} from 'app/components/layout/msg/Content';
import ReplyButton from 'app/components/layout/msg/reaction/ReplyBtn';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Event, PrivateKey, PublicKey } from 'service/api';
import { shortPublicKey } from 'service/helper';
import { useTimeSince } from 'hooks/useTimeSince';
import { ShowThread } from './reaction/ShowThread';
import { ShareArticle } from './Share';
import { ReplyToUserList } from './ReplyToUserList';
import { CallWorker } from 'service/worker/callWorker';
import { Like } from './reaction/Like';
import { Bookmark } from './reaction/Bookmark';
import { Repost } from './reaction/Repost';
import { Tipping } from './reaction/Tipping';
import { Delete } from './reaction/Delete';

const styles = {
  root: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    color: 'black',
    fontSize: '2em',
    fontWeight: '380',
    diplay: 'block',
    width: '100%',
    margin: '5px',
  },
  ul: {
    padding: '10px',
    background: 'white',
    borderRadius: '5px',
  },
  li: {
    display: 'inline',
    padding: '10px',
  },
  content: {
    margin: '5px 0px',
    minHeight: '700px',
    background: 'white',
    borderRadius: '5px',
  },
  left: {
    height: '100%',
    minHeight: '700px',
    padding: '20px',
  },
  right: {
    minHeight: '700px',
    backgroundColor: '#E1D7C6',
    padding: '20px',
  },
  postBox: {},
  postHintText: {
    color: '#acdae5',
    marginBottom: '5px',
  },
  postTextArea: {
    resize: 'none' as const,
    boxShadow: 'inset 0 0 1px #aaa',
    border: '1px solid #b9bcbe',
    width: '100%',
    height: '80px',
    fontSize: '14px',
    padding: '5px',
    overflow: 'auto',
  },
  btn: {
    display: 'box',
    textAlign: 'right' as const,
  },
  message: {
    marginTop: '5px',
  },
  msgsUl: {
    padding: '5px',
  },
  msgItem: {
    display: 'block',
    borderBottom: '1px dashed #ddd',
    padding: '15px 0',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    maxWidth: '100%',
  },
  msgWord: {
    fontSize: '14px',
    display: 'block',
  },
  userName: {
    //textDecoration: 'underline',
    color: 'black',
    fontSize: '15px',
    fontWeight: '500',
    marginRight: '5px',
  },
  time: {
    color: 'gray',
    fontSize: '12px',
    marginTop: '5px',
  },
  reaction: {
    color: 'gray',
    fontSize: '12px',
    marginTop: '5px',
  },
  smallBtn: {
    fontSize: '12px',
    //marginLeft: '5px',
    border: 'none' as const,
    background: 'none',
  },
  connected: {
    fontSize: '18px',
    fontWeight: '500',
    color: 'green',
  },
  disconnected: {
    fontSize: '18px',
    fontWeight: '500',
    color: 'red',
  },
  userProfileAvatar: {
    width: '60px',
    height: '60px',
  },
  userProfileName: {
    fontSize: '20px',
    fontWeight: '500',
  },
};

interface KeyPair {
  publicKey: PublicKey;
  privateKey: PrivateKey;
}

export interface TextMsgProps {
  name?: string;
  avatar?: string;
  pk: string;
  replyTo: { name?: string; pk: string }[];
  content: string;
  createdAt: number;
  eventId: string;
  keyPair?: KeyPair;
  style?: React.CSSProperties;
  worker: CallWorker;
}

export const TextMsg = ({
  replyTo,
  avatar,
  name,
  pk,
  content,
  createdAt,
  eventId,
  keyPair,
  style,
  worker,
}: TextMsgProps) => {
  const { t } = useTranslation();
  const bg = { backgroundColor: 'white' };
  return (
    <li style={{ ...styles.msgItem, ...bg, ...style }}>
      <Grid container>
        <div style={{ width: '75px' }}>
          <ProfileAvatar name={pk} picture={avatar} />
        </div>
        <span style={{ float: 'right', width: '80%' }}>
          <span style={styles.msgWord}>
            <ProfileName name={name} createdAt={createdAt} pk={pk} />
            <ReplyToUserList replyTo={replyTo} />
            <Content text={content} />
          </span>

          <ReactionGroups
            worker={worker!}
            keyPair={keyPair!}
            pk={pk}
            eventId={eventId}
          />
        </span>
      </Grid>
    </li>
  );
};

export const ProfileTextMsg = ({
  replyTo,
  pk,
  content,
  createdAt,
  eventId,
  keyPair,
  worker,
}: Omit<TextMsgProps, 'avatar' | 'name'>) => {
  const { t } = useTranslation();
  const [hover, setHover] = React.useState(false);
  //const bg = { backgroundColor: hover ? '#f5f5f5' : 'white' };
  const bg = { backgroundColor: 'white' };

  return (
    <li
      style={{ ...styles.msgItem, ...bg }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Grid container>
        <Grid item xs={12}>
          <span style={styles.msgWord}>
            <ReplyToUserList replyTo={replyTo} />
            <Content text={content} />
          </span>
          <div style={{ marginTop: '15px' }}>
            <span style={styles.time}>{useTimeSince(createdAt)}</span>

            <span style={{ marginLeft: '15px' }}>
              <span style={styles.reaction}>
                <Tipping eventId={eventId} />
              </span>
              <span style={styles.reaction}>
                <Like
                  toEventId={eventId}
                  toPublicKey={pk}
                  worker={worker}
                  signPrivKey={keyPair?.privateKey}
                />
              </span>
              <span style={styles.reaction}>
                <Repost eventId={eventId} />
              </span>
              <span style={styles.reaction}>
                <Bookmark eventId={eventId} />
              </span>
              <span style={styles.reaction}>
                <Delete eventId={eventId} />
              </span>
              <span style={styles.reaction}>
                <ShowThread eventId={eventId} />
              </span>
              <span style={styles.reaction}>
                <ReplyButton
                  replyToEventId={eventId}
                  replyToPublicKey={pk}
                  myKeyPair={keyPair}
                  worker={worker}
                />
              </span>
            </span>
          </div>
        </Grid>
      </Grid>
    </li>
  );
};

export interface BlogMsgProps {
  name?: string;
  avatar?: string;
  pk: string;
  title: string;
  blogName: string;
  articleId: string;
  createdAt: number;
  keyPair?: KeyPair;
  onSubmitShare: (event: Event) => any;
}

export const BlogMsg = ({
  avatar,
  name,
  pk,
  title,
  blogName,
  articleId,
  createdAt,
  keyPair,
  onSubmitShare,
}: BlogMsgProps) => {
  const { t } = useTranslation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [hover, setHover] = React.useState(false);
  const bg = { backgroundColor: hover ? '#f5f5f5' : 'white' };

  const shareUrl = () => {
    return (
      ' ' +
      window.location.protocol +
      '//' +
      window.location.host +
      '/article/' +
      pk +
      '/' +
      articleId
    );
  };

  return (
    <li
      style={{ ...styles.msgItem, ...bg }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Grid container>
        <Grid item xs={12} sm={2} style={{ textAlign: 'left' as const }}>
          <ProfileAvatar picture={avatar} name={pk} />
        </Grid>
        <Grid item xs={12} sm={10}>
          <span style={styles.msgWord}>
            <ProfileName name={name} pk={pk} createdAt={createdAt} />
            <ArticleContentNoAvatar
              text={''}
              shareUrl={shareUrl()}
              title={title}
              blogName={blogName}
            />
          </span>
          <span style={styles.time}>
            <button
              onClick={() => setIsShareModalOpen(true)}
              style={styles.smallBtn}
            >
              {t('blog.rePostShare')}
            </button>
          </span>
          <ShareArticle
            suffix={' ' + shareUrl()}
            url={shareUrl()}
            title={title}
            blogName={blogName}
            blogAvatar={avatar}
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            pk={pk}
            id={articleId}
            loginUser={keyPair}
            onSubmit={onSubmitShare}
          />
        </Grid>
      </Grid>
    </li>
  );
};

export const ProfileBanner = ({
  picture,
  name,
  style,
}: {
  picture?: string;
  name?: string;
  style?: React.CSSProperties;
}) => {
  const [url, setUrl] = useState<string | undefined>();
  const defaultUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  useEffect(() => {
    console.log(picture);
    if (picture != null) {
      setUrl(picture);
    }
  }, [picture]);

  const handleError = () => {
    setUrl(defaultUrl);
  };

  return (
    <img
      style={{
        ...{
          width: '100%',
          maxHeight: '150px',
          maxWidth: '100%',
        },
        ...style,
      }}
      src={url || defaultUrl}
      alt=""
      onError={handleError}
    />
  );
};

export const ProfileAvatar = ({
  picture,
  name,
  style,
}: {
  picture?: string;
  name?: string;
  style?: React.CSSProperties;
}) => {
  const theme = 'marble';
  const defaultUrl = `https://source.boringavatars.com/${theme}/60/${
    name || Date.now().toString()
  }?color=65A766,F1CF4D,148F8D`;
  const [url, setUrl] = useState<string | undefined>();

  useEffect(() => {
    if (picture != null) {
      setUrl(picture);
    }
  }, [picture]);

  const handleError = () => {
    setUrl(defaultUrl);
  };

  return (
    <img
      style={{ ...styles.avatar, ...style }}
      src={url || defaultUrl}
      alt=""
      onError={handleError}
    />
  );
};

export const ProfileName = ({
  name,
  pk,
  createdAt,
}: {
  name?: string;
  pk: string;
  createdAt: number;
}) => {
  return (
    <div>
      <a style={styles.userName} href={'/user/' + pk}>
        @{name || '__'}{' '}
      </a>
      <span style={styles.time}>
        {' · '}
        {useTimeSince(createdAt)}
      </span>
    </div>
  );
};

export const ReactionGroups = ({
  eventId,
  worker,
  pk,
  keyPair,
}: {
  worker: CallWorker;
  keyPair: KeyPair;
  pk: string;
  eventId: string;
}) => {
  return (
    <div style={{ marginTop: '15px' }}>
      <span>
        <span
          style={styles.reaction}
          onClick={() => {
            alert('working on it!');
          }}
        >
          <Tipping eventId={eventId} />
        </span>
        <span
          style={styles.reaction}
          onClick={() => {
            alert('working on it!');
          }}
        >
          <Like
            toEventId={eventId}
            toPublicKey={pk}
            worker={worker}
            signPrivKey={keyPair?.privateKey}
          />
        </span>
        <span
          style={styles.reaction}
          onClick={() => {
            alert('working on it!');
          }}
        >
          <Repost eventId={eventId} />
        </span>
        <span
          style={styles.reaction}
          onClick={() => {
            alert('working on it!');
          }}
        >
          <Bookmark eventId={eventId} />
        </span>

        <span style={styles.reaction}>
          <ShowThread eventId={eventId} />
        </span>
        <span style={styles.reaction}>
          <ReplyButton
            replyToEventId={eventId}
            replyToPublicKey={pk}
            myKeyPair={keyPair}
            worker={worker}
          />
        </span>
      </span>
    </div>
  );
};
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
