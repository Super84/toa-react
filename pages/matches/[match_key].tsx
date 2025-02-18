import type { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { PlayCircleOutline, QueryBuilder } from '@mui/icons-material';
import { useTranslate } from '../../i18n/i18n';
import { fetchMatchData, IRawMatchProps, useMatchData } from '../../lib/page-helpers/match-helper';
import { readableDate } from '../../lib/utils/common';
import SimpleMatchTable from '../../components/SimpleMatchTable';
import MatchDetailsCard from '../../components/MatchDetails/MatchDetailsCard';

const MatchPage: NextPage<IRawMatchProps> = props => {
  const { match } = useMatchData(props);
  const t = useTranslate();

  return (
    <>
      <Typography variant={'h4'}>{match.matchName}</Typography>
      <Typography variant={'subtitle1'}>
        <NextLink href={`/events/${match.event.eventKey}/rankings`}>
          <a className="text-black">
            {match.event.divisionName
              ? match.event.eventName + ' - ' + match.event.divisionName
              : match.event.eventName}
          </a>
        </NextLink>
      </Typography>
      <Grid container direction={'row'} spacing={2}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant={'h5'}>{t('pages.match.match_info')}</Typography>
              <Divider />
              {match.redScore === -1 &&
                match.blueScore === -1 &&
                match.scheduledTime &&
                match.scheduledTime !== '0000-00-00 00:00:00' && (
                  <Typography variant={'body1'}>
                    <QueryBuilder />
                    {t('pages.match.scheduled_time')}: {readableDate(match.scheduledTime)}
                  </Typography>
                )}
              {!match.videoURL /* TODO: Link to suggestions tab eventually*/ && (
                <Typography className={'mt-2 mb-2'} variant={'body1'}>
                  <PlayCircleOutline className={'me-1'} />
                  {t('pages.match.no_video')}
                </Typography>
              )}
              <SimpleMatchTable match={match} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card>
            <MatchDetailsCard match={match} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    return { props: await fetchMatchData(String(query.match_key)) };
  } catch (err) {
    return { notFound: true };
  }
};

export default MatchPage;
