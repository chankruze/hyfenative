import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  Screen,
  UIDataDisplay,
  UIEssentials,
  UIFeedback,
  UIForms,
  UILayout,
  UINavigation,
  UIOverlay,
} from '@/components';
import { AppRoute } from '@/navigation/routes';
import type { RootStackScreenProps } from '@/navigation/navigation-types';
import { useThemeValue } from '@/theme';
import type { Theme } from '@/theme';

type Props = RootStackScreenProps<AppRoute.UiDemo>;

const selectOptions: UIForms.SelectOption[] = [
  { label: 'Temple', value: 'temple' },
  { label: 'Home', value: 'home' },
  { label: 'Online', value: 'online' },
];

const tabs = [
  { key: 'overview', label: 'Overview', icon: 'view-dashboard-outline' as const },
  { key: 'items', label: 'Items', icon: 'format-list-bulleted' as const },
  { key: 'profile', label: 'Profile', icon: 'account-outline' as const },
];

export function UiDemoScreen({ navigation }: Props) {
  const theme = useThemeValue();
  const styles = createStyles(theme);

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [service, setService] = useState<string | undefined>();
  const [allowUpdates, setAllowUpdates] = useState(true);
  const [consent, setConsent] = useState(false);
  const [channel, setChannel] = useState<'sms' | 'email'>('sms');
  const [tab, setTab] = useState('overview');

  const [showModal, setShowModal] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  return (
    <Screen scroll>
      <UILayout.Stack spacing="md" style={styles.page}>
        <UINavigation.AppBar
          title="UI Demo"
          subtitle="Grouped component exports"
          left={
            <UIEssentials.Button
              variant="ghost"
              size="sm"
              title="Back"
              onPress={() => navigation.navigate(AppRoute.Welcome)}
            />
          }
        />

        <UIEssentials.Card>
          <UILayout.Stack spacing="sm">
            <Text style={styles.sectionTitle}>Essentials</Text>
            <UILayout.HStack spacing="xs" style={styles.wrap}>
              <UIEssentials.Button title="Primary" size="sm" />
              <UIEssentials.Button title="Secondary" variant="secondary" size="sm" />
              <UIEssentials.Button title="Ghost" variant="ghost" size="sm" />
              <UIEssentials.Button title="Delete" variant="destructive" size="sm" />
            </UILayout.HStack>
          </UILayout.Stack>
        </UIEssentials.Card>

        <UIEssentials.Card>
          <UILayout.Stack spacing="sm">
            <Text style={styles.sectionTitle}>Form + Field Pattern</Text>
            <UIForms.Form spacing="sm">
              <UIForms.Field>
                <UIForms.FieldLabel htmlFor="demo-name">Name</UIForms.FieldLabel>
                <UIForms.Input
                  id="demo-name"
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Rohan"
                />
                <UIForms.FieldDescription>Who is booking the ritual.</UIForms.FieldDescription>
              </UIForms.Field>

              <UIForms.Field>
                <UIForms.FieldLabel htmlFor="demo-notes">Notes</UIForms.FieldLabel>
                <UIForms.TextArea
                  id="demo-notes"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Anything priests should know"
                />
              </UIForms.Field>

              <UIForms.Field>
                <UIForms.FieldLabel>Service Type</UIForms.FieldLabel>
                <UIForms.Select
                  value={service}
                  onValueChange={setService}
                  options={selectOptions}
                  placeholder="Choose one"
                />
              </UIForms.Field>

              <UILayout.HStack spacing="sm">
                <UIForms.Switch value={allowUpdates} onValueChange={setAllowUpdates} />
                <Text style={styles.body}>Get updates</Text>
              </UILayout.HStack>

              <UIForms.Checkbox
                checked={consent}
                onCheckedChange={setConsent}
                label="I accept terms"
              />

              <UILayout.HStack spacing="md">
                <UIForms.Radio
                  selected={channel === 'sms'}
                  onSelect={() => setChannel('sms')}
                  label="SMS"
                />
                <UIForms.Radio
                  selected={channel === 'email'}
                  onSelect={() => setChannel('email')}
                  label="Email"
                />
              </UILayout.HStack>
            </UIForms.Form>
          </UILayout.Stack>
        </UIEssentials.Card>

        <UIEssentials.Card>
          <UILayout.Stack spacing="sm">
            <Text style={styles.sectionTitle}>Data Display</Text>
            <UILayout.HStack spacing="sm" style={styles.wrap}>
              <UIDataDisplay.Avatar name="Hyfe Native" />
              <UIDataDisplay.Badge label="New" variant="primary" />
              <UIDataDisplay.Chip label="Booked" selected />
              <UIDataDisplay.Tag label="Temple" icon="map-marker-outline" />
            </UILayout.HStack>
            <UIDataDisplay.Divider />
          </UILayout.Stack>
        </UIEssentials.Card>

        <UIEssentials.Card>
          <UILayout.Stack spacing="sm">
            <Text style={styles.sectionTitle}>Feedback</Text>
            <UIFeedback.Alert
              title="Heads up"
              description="Your profile is 80% complete."
            />
            <UILayout.HStack spacing="sm" style={styles.wrap}>
              <UIFeedback.Spinner />
              <UIFeedback.Skeleton width={140} />
            </UILayout.HStack>
            <UIFeedback.EmptyState
              title="No bookings"
              description="Create one to see it here."
            />
            <UIFeedback.ErrorState
              title="Payment failed"
              description="Try again after checking your network."
              actionLabel="Retry"
              onActionPress={() => {}}
            />
          </UILayout.Stack>
        </UIEssentials.Card>

        <UIEssentials.Card>
          <UILayout.Stack spacing="sm">
            <Text style={styles.sectionTitle}>Navigation + Overlay</Text>
            <UINavigation.TabBar items={tabs} activeKey={tab} onChange={setTab} />

            <UILayout.HStack spacing="sm" style={styles.wrap}>
              <UIEssentials.Button
                size="sm"
                title="Open Modal"
                onPress={() => setShowModal(true)}
              />
              <UIEssentials.Button
                size="sm"
                variant="secondary"
                title="Open Sheet"
                onPress={() => setShowSheet(true)}
              />
            </UILayout.HStack>
          </UILayout.Stack>
        </UIEssentials.Card>
      </UILayout.Stack>

      <UIOverlay.AppModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Demo Modal"
        footer={
          <UIEssentials.Button
            title="Close"
            variant="secondary"
            onPress={() => setShowModal(false)}
            fullWidth
          />
        }
      >
        <Text style={styles.body}>This is the token-based modal wrapper.</Text>
      </UIOverlay.AppModal>

      <UIOverlay.BottomSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        title="Demo Bottom Sheet"
        footer={
          <UIEssentials.Button
            title="Done"
            onPress={() => setShowSheet(false)}
            fullWidth
          />
        }
      >
        <Text style={styles.body}>Gorhom bottom sheet wrapper.</Text>
      </UIOverlay.BottomSheet>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    sectionTitle: {
      color: theme.colors.text,
      ...theme.typography.label,
    },
    wrap: {
      flexWrap: 'wrap',
    },
    body: {
      color: theme.colors.text,
      ...theme.typography.bodySm,
    },
  });
